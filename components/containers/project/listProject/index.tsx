import CardProject from "@/components/ui/CardProject";
import React from "react";

function ListProject({ filtered }: any) {
  return (
    <div className="mx-8 mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filtered
        ?.sort(
          (a: any, b: any) =>
            new Date(`${b?.createdAt}`).getTime() -
            new Date(`${a?.createdAt}`).getTime(),
        )
        .map((project: any) => <CardProject key={project.id} {...project} />)}
    </div>
  );
}

export default ListProject;
