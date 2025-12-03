import type { AssignClassParamsForStudent } from "../../../types/student";
export declare const assignClassForStudentApi: (params: AssignClassParamsForStudent) => Promise<any>;
export declare const withdrawClassForStudentApi: (classId: string) => Promise<any>;
export declare const checkAssignClassForStudentApi: (classId: string) => Promise<any>;
export declare const getAllAssignedClassForStudentApi: () => Promise<any>;
