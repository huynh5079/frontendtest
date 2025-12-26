import type {
    CreateChildAccountParams,
    LinkExistingChildRequest,
    UpdateChildRequest,
} from "../../../types/parent";
import request from "../../request";

export const createChildAccountApi = async (
    params: CreateChildAccountParams
) => {
    const data = await request.post(
        "/parent/manage-children/create-account",
        params
    );
    return data.data;
};

export const getAllChildAccountApi = async () => {
    const data = await request.get("/parent/manage-children");
    return data.data;
};

// ... preexisting code ...
export const getDetailChildAccountApi = async (childId: string) => {
    const data = await request.get(`/parent/manage-children/detail/${childId}`);
    return data.data;
};

export const linkChildAccountApi = async (
    params: LinkExistingChildRequest
) => {
    const data = await request.post("/parent/manage-children/link", params);
    return data.data;
};

export const updateChildAccountApi = async (
    studentId: string,
    params: UpdateChildRequest
) => {
    const data = await request.put(
        `/parent/manage-children/update/${studentId}`,
        params
    );
    return data.data;
};

export const unlinkChildAccountApi = async (studentId: string) => {
    const data = await request.delete(
        `/parent/manage-children/unlink-with-children/${studentId}`
    );
    return data.data;
};
