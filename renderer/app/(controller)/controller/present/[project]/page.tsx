// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import ControllerScreen from './controlScreen';
import SelectScreen from './selectScreen';
import path from 'node:path';
import React from 'react';
import fs from 'node:fs';

export default function Page({ params }: { params: { project: string }}): React.ReactElement {
  return <SelectScreen>
    <ControllerScreen project={JSON.parse(fs.readFileSync(path.resolve(decodeURIComponent(params.project), '.glp', 'project.json'), 'utf8'))} />
  </SelectScreen>;
}
