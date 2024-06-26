import { CoordinateOfCyclingInterface } from "@/interfaces/coordinate";
import { axiosClient } from "./axios-cilent";

export const cyclingApi = {
  sendCoordinate(code: string, coordinate: CoordinateOfCyclingInterface) {
    return axiosClient.post(`/cycling/coord`, { code, coordinate });
  },
};
