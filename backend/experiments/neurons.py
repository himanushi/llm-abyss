"""MLP ニューロン活性化分析。指定レイヤーの MLP ニューロンの活性化パターンを抽出する。"""

from __future__ import annotations

import torch
from transformer_lens import HookedTransformer

from schemas.experiments import NeuronActivation, NeuronsResponse
from utils.serialization import tensor_to_list


def run_neuron_analysis(
    model: HookedTransformer,
    text: str,
    layer: int,
    top_k: int = 20,
) -> NeuronsResponse:
    """指定レイヤーの MLP ニューロン活性化を分析する。"""
    tokens = model.to_tokens(text)
    str_tokens = model.to_str_tokens(text)

    # MLP の活性化出力をキャッシュ
    hook_name = f"blocks.{layer}.mlp.hook_post"
    _, cache = model.run_with_cache(tokens, names_filter=hook_name)

    if hook_name not in cache:
        raise ValueError(f"レイヤー {layer} の MLP 活性化が見つかりません。")

    activations = cache[hook_name][0]  # [seq_len, d_mlp]
    n_positions, d_mlp = activations.shape

    # 全ポジション×ニューロンの最大活性化で top-k を選出
    flat = activations.abs().flatten()
    top_k_actual = min(top_k, flat.numel())
    top_vals, top_flat_indices = torch.topk(flat, top_k_actual)

    top_neurons: list[NeuronActivation] = []
    top_neuron_indices = set()

    for flat_idx in top_flat_indices:
        pos = (flat_idx // d_mlp).item()
        neuron_idx = (flat_idx % d_mlp).item()
        act_val = activations[pos, neuron_idx].item()

        top_neurons.append(NeuronActivation(
            neuron_index=neuron_idx,
            activation=act_val,
            token=str_tokens[pos],
            token_position=pos,
        ))
        top_neuron_indices.add(neuron_idx)

    # activation_map: top-k ニューロンの全ポジションでの活性化
    sorted_indices = sorted(top_neuron_indices)
    if sorted_indices:
        idx_tensor = torch.tensor(sorted_indices, device=activations.device)
        activation_map = activations[:, idx_tensor]
        activation_map_list = tensor_to_list(activation_map)
    else:
        activation_map_list = []

    return NeuronsResponse(
        tokens=list(str_tokens),
        layer=layer,
        top_neurons=top_neurons,
        activation_map=activation_map_list,
    )
