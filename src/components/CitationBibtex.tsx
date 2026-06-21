"use client";

import { useState } from "react";

// Verbatim from arXiv's exported BibTeX for 2606.17055 (the "Jim and Fan"
// split is arXiv's own author parsing of "Jim Fan" — kept as-is to match the
// canonical citation).
const BIBTEX = `@misc{niu2026trextactilereactivedexterousmanipulation,
      title={T-Rex: Tactile-Reactive Dexterous Manipulation},
      author={Dantong Niu and Zhuoyang Liu and Zekai Wang and Boning Shao and Zhao-Heng Yin and Anirudh Pai and Yuvan Sharma and Stefano Saravalle and Ruijie Zheng and Jing Wang and Ryan Punamiya and Mengda Xu and Yuqi Xie and Yunfan Jiang and Letian Fu and Konstantinos Kallidromitis and Matteo Gioia and Junyi Zhang and Jiaxin Ge and Haiwen Feng and Fabio Galasso and Wei Zhan and David M. Chan and Yutong Bai and Roei Herzig and Jiahui Lei and Fei-Fei Li and Ken Goldberg and Jitendra Malik and Pieter Abbeel and Yuke Zhu and Danfei Xu and Jim and Fan and Trevor Darrell},
      year={2026},
      eprint={2606.17055},
      archivePrefix={arXiv},
      primaryClass={cs.RO},
      url={https://arxiv.org/abs/2606.17055},
}`;

export default function CitationBibtex() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BIBTEX);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <div className="bibtex">
      <button className="bibtex__copy" onClick={copy} type="button" aria-label="Copy BibTeX">
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <pre>{BIBTEX}</pre>
    </div>
  );
}
