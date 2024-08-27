declare module "occt-import-js" {
  function init(): Promise<{
    ReadStepFile: (fileBuffer: Uint8Array, options: null) => ReadStepFileResult;
  }>;

  export interface ReadStepFileResult {
    meshes: {
      name: string;
      attributes: {
        normal?: { array: number[] };
        position: { array: number[] };
      };
      brep_faces: { first: number; last: number; color: null }[];
      color: [number, number, number];
      index: { array: number[] };
    }[];
  }

  export default init;
}
