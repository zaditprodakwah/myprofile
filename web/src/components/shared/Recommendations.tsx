import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, Target } from "lucide-react";

interface RecommendedTool {
  id: string;
  name: string;
  slug: string;
  category: string;
  tagline: string;
}

interface RecommendedSolution {
  id: string;
  title: string;
  slug: string;
  industry: string;
}

interface Props {
  tools?: RecommendedTool[];
  solutions?: RecommendedSolution[];
  title?: string;
}

export function Recommendations({ tools, solutions, title }: Props) {
  if (!tools?.length && !solutions?.length) return null;

  return (
    <div className="space-y-8">
      {title && (
        <h3 className="text-2xl font-black text-white flex items-center gap-3">
          <Zap className="text-amber-500" size={24} /> {title}
        </h3>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tools */}
        {tools?.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.category.toLowerCase()}/${tool.slug}`}
            className="group p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/60">
                Recommended Tool
              </span>
              <h4 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
                {tool.name}
              </h4>
              <p className="text-sm text-slate-400 line-clamp-2">
                {tool.tagline}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
              Analyze Stack <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}

        {/* Solutions */}
        {solutions?.map((sol) => (
          <Link
            key={sol.id}
            href={`/solutions/${sol.industry}/${sol.slug}`}
            className="group p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/60">
                Relevant Solution
              </span>
              <h4 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
                {sol.title}
              </h4>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
              View Framework <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
