export interface MaterialItemDto {
    id: string;
    fileName: string;
    url: string;
    mediaType: string;
    fileSize: number;
    createdAt: string;
    uploadedByUserId: string;
}

export interface ApiResponse<T> {
    status: "success" | "fail";
    message?: string;
    data: T;
}

