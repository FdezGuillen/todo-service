const basePath: string = process.env.LABEL_SERVICE_EXTERNAL_PATH;

export const getAllLabelsPath = `${basePath}/labels`;
export const getLabelByIdPath = (id: string) => `${getAllLabelsPath}/${id}`;
