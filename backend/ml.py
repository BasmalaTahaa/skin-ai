import os
import json
import joblib
import numpy as np
import torch
from PIL import Image

import torchvision.transforms as T
from torchvision.models import convnext_small, resnet50, efficientnet_b0
import timm


# ======================
# PATHS & CONFIG
# ======================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models_ml")
STACK_DIR  = os.path.join(MODELS_DIR, "stacking_model")

CONVNEXT_PATH = os.path.join(MODELS_DIR, "convnext_small_best.pt")
EFFNET_PATH   = os.path.join(MODELS_DIR, "effnet_b0_best.pt")
RESNET_PATH   = os.path.join(MODELS_DIR, "resnet50_best.pt")

META_PATH = os.path.join(STACK_DIR, "meta_lr.pkl")
META_INFO = os.path.join(STACK_DIR, "feature_cols.json")

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


# ======================
# GLOBALS (LAZY LOAD)
# ======================
_convnext_model = None
_effnet_model   = None
_resnet_model   = None
_meta_model     = None

FEATURE_COLS = None
CLASSES      = None
BASES        = None


# ======================
# PREPROCESS (NOTEBOOK)
# ======================
transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(
        mean=[0.5556, 0.4244, 0.3964],
        std=[0.3095, 0.2566, 0.2551],
    ),
])


# ======================
# LOAD UTILS
# ======================
def _safe_load_state_dict(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model not found: {path}")
    ckpt = torch.load(path, map_location=DEVICE)
    if isinstance(ckpt, dict):
        return ckpt.get("state_dict", ckpt)
    return ckpt


def load_meta():
    global FEATURE_COLS, CLASSES, BASES

    print("🔹 Loading meta model...")
    meta = joblib.load(META_PATH)

    with open(META_INFO, "r") as f:
        info = json.load(f)

    FEATURE_COLS = info["feature_cols"]
    CLASSES      = info["classes"]
    BASES        = info["bases"]

    return meta


def load_resnet():
    print("🔹 Loading ResNet50...")
    model = resnet50(weights=None)
    model.fc = torch.nn.Linear(model.fc.in_features, len(CLASSES))
    model.load_state_dict(_safe_load_state_dict(RESNET_PATH), strict=True)
    model.to(DEVICE).eval()
    return model


def load_effnet():
    print("🔹 Loading EfficientNet-B0...")
    model = efficientnet_b0(weights=None)

    # تعديل classifier زي التدريب
    in_feats = model.classifier[1].in_features
    model.classifier = torch.nn.Sequential(
        torch.nn.Dropout(0.2),
        torch.nn.Linear(in_feats, len(CLASSES))
    )

    state = _safe_load_state_dict(EFFNET_PATH)
    model.load_state_dict(state, strict=True)

    model.to(DEVICE).eval()
    return model



def load_convnext():
    print("🔹 Loading ConvNeXt Small...")
    model = convnext_small(weights=None)
    model.load_state_dict(_safe_load_state_dict(CONVNEXT_PATH), strict=False)
    model.to(DEVICE).eval()
    return model


def load_models():
    global _meta_model, _resnet_model, _effnet_model, _convnext_model

    if _meta_model is None:
        _meta_model = load_meta()

    if _resnet_model is None:
        _resnet_model = load_resnet()

    if _effnet_model is None:
        _effnet_model = load_effnet()

    if _convnext_model is None:
        _convnext_model = load_convnext()


# ======================
# INFERENCE HELPERS
# ======================
@torch.no_grad()
def _predict_probs(model, x):
    logits = model(x)
    return torch.softmax(logits, dim=1).cpu().numpy()[0]


def build_meta_features(p_res, p_eff, p_cnx):
    feat_map = {}

    for i, cls in enumerate(CLASSES):
        feat_map[f"p_{cls}_resnet50"]       = p_res[i]
        feat_map[f"p_{cls}_effnet_b0"]      = p_eff[i]
        feat_map[f"p_{cls}_convnext_small"] = p_cnx[i]

    x_vec = np.array(
        [feat_map[c] for c in FEATURE_COLS],
        dtype=np.float32
    ).reshape(1, -1)

    return x_vec


# ======================
# MAIN API
# ======================
def _to_py(x):
    import numpy as np

    if isinstance(x, (np.floating,)):
        return float(x)
    if isinstance(x, (np.integer,)):
        return int(x)
    if isinstance(x, np.ndarray):
        return x.tolist()
    return x

def predict_skin(image_path: str, user_message: str | None = None):

    load_models()

    img = Image.open(image_path).convert("RGB")
    x = transform(img).unsqueeze(0).to(DEVICE)

    p_res = _predict_probs(_resnet_model, x)
    p_eff = _predict_probs(_effnet_model, x)
    p_cnx = _predict_probs(_convnext_model, x)

    meta_x = build_meta_features(p_res, p_eff, p_cnx)

    probs = _meta_model.predict_proba(meta_x)[0]
    idx = int(np.argmax(probs))

    result = {
        "label": CLASSES[idx],
        "confidence": float(probs[idx]) * 100,
        "probs": {CLASSES[i]: float(probs[i]) for i in range(len(CLASSES))},
        "resnet_probs":   {CLASSES[i]: float(p_res[i]) for i in range(len(CLASSES))},
        "effnet_probs":   {CLASSES[i]: float(p_eff[i]) for i in range(len(CLASSES))},
        "convnext_probs": {CLASSES[i]: float(p_cnx[i]) for i in range(len(CLASSES))},
    }

    # 🔴 sanitize EVERYTHING
    clean = {}
    for k, v in result.items():
        if isinstance(v, dict):
            clean[k] = {kk: _to_py(vv) for kk, vv in v.items()}
        else:
            clean[k] = _to_py(v)

    return clean
