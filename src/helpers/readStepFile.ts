import occtimportjs from "occt-import-js";

export async function readStepFile(fileUrl: string) {
  // init occt-import-js
  const occt = await occtimportjs();

  // download a step file
  const response = await fetch(fileUrl);
  const buffer = await response.arrayBuffer();

  // read the imported step file
  const fileBuffer = new Uint8Array(buffer);
  return occt.ReadStepFile(fileBuffer, null);
}
