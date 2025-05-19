import React from "react";

function SectionResume({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="size-5 text-slate-600" />
        <h2 className="text-lg font-semibold lg:text-xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default SectionResume;
