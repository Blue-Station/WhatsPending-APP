import { redirect } from 'next/navigation';
import { ReactElement } from 'react';
import path from 'node:path';
import InteractForm from './Form';
import fs from 'node:fs';

async function processProject(project: string): Promise<number> {
  return new Promise((resolve) => {
    if (!project || !fs.existsSync(project)) return resolve(0);

    // find the project.json file inside the project folder
    const projectPath = path.resolve(project, '.glp', 'project.json');

    if (fs.existsSync(projectPath)) return resolve(1);

    if (!fs.existsSync(path.resolve(project, '.glp'))) fs.mkdirSync(path.resolve(project, '.glp'));

    resolve(2);
  });
}

export default async function Page({ params }: { params: Promise<{ project: string }> }): Promise<ReactElement> {
  const parameters = (await params);
  const project = decodeURIComponent(parameters.project);

  const result = await processProject(project);

  if (result === 0) return redirect('/home');
  else if (result === 1) return redirect(`/controller/present/${encodeURIComponent(project)}`);

  return <InteractForm path={project} basename={path.basename(project)} />;
}
