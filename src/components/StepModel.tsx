import * as THREE from "three";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { ReadStepFileResult } from "occt-import-js";

import { GroupProps } from "@react-three/fiber";
import { loadStep1 } from "../helpers/loadStep1";
import { readStepFile } from "../helpers/readStepFile";

export interface StepModelRef {
  readStepFileResult?: ReadStepFileResult;
}
export interface StepModelProps extends Omit<GroupProps, "ref"> {
  url: string;
  loadStep?: (result: ReadStepFileResult) => THREE.Object3D;
}
export const StepModel = forwardRef<StepModelRef, StepModelProps>(
  ({ url, loadStep = loadStep1, ...props }, ref) => {
    const [readStepFileResult, setReadStepFileResult] =
      useState<ReadStepFileResult>();

    useEffect(() => {
      (async () => {
        setReadStepFileResult(await readStepFile(url));
      })();
    }, [url, loadStep]);

    const obj = useMemo(
      () => (readStepFileResult ? loadStep(readStepFileResult) : undefined),
      [readStepFileResult, loadStep]
    );

    useImperativeHandle(ref, () => ({ readStepFileResult }), [
      readStepFileResult,
    ]);

    if (!obj) return null;

    return (
      <group {...props}>
        <primitive object={obj} />
      </group>
    );
  }
);
