export const routes = {
    home: "/",
    about: "/about",
    login: "/login",
    forgot_password: "/forgot_password",
    unauthorized: "/unauthorized",
    verify_otp: {
        student: "/verify_otp/student",
        parent: "/verify_otp/parent",
        tutor: "/verify_otp/tutor",
        forgot_password: "/verify_otp/forgot_password",
    },
    register: {
        general: "/register",
        student: "/register/student",
        tutor: "/register/tutor",
        parent: "/register/parent",
    },
    tutor: {
        list: "/tutor",
        detail: "/tutor/:id/detail",
        dashboard: "/tutor/dashboard",
        schedule: "/tutor/schedule",
        class: {
            list: "/tutor/class",
            create: "/tutor/class/create",
            detail: "/tutor/class/:id/detail",
        },
        information: "/tutor/information",
        change_password: "/tutor/information/change_password",
        wallet: "/tutor/wallet",
        booking: {
            list: "/tutor/booking",
            detail: "/tutor/booking/:id/detail",
        },
        request: {
            list: "/tutor/request",
            detail: "/tutor/request/:id/detail",
        },
    },
    course: {
        list: "/course",
        detail: "/course/:id/detail",
    },
    student: {
        home: "/student",
        tutor: {
            list: "/student/tutor",
            detail: "/student/tutor/:id/detail",
            book: "/student/tutor/book/:id",
        },
        course: {
            list: "/student/course",
            detail: "/student/course/:id/detail",
        },
        information: "/student/information",
    },
    parent: {
        home: "/parent",
        tutor: {
            list: "/parent/tutor",
            detail: "/parent/tutor/:id/detail",
            book: "/parent/tutor/book/:id",
        },
        course: {
            list: "/parent/course",
            detail: "/parent/course/:id/detail",
        },
        information: "/parent/information",
    },
    admin: {
        dashboard: "/admin/dashboard",
        student: {
            list: "/admin/student",
            detail: "/admin/student/:id/detail",
        },
        parent: {
            list: "/admin/parent",
            detail: "/admin/parent/:id/detail",
        },
        tutor: {
            list: "/admin/tutor",
            detail: "/admin/tutor/:id/detail",
        },
        class: {
            list: "/admin/class",
        },
        notification: {
            list: "/admin/notification",
        },
        report: {
            list: "/admin/report",
        },
        transaction: {
            tutor: {
                list: "/admin/transaction/tutor",
            },
            student: {
                list: "/admin/transaction/student",
            },
            parent: {
                list: "/admin/transaction/parent",
            },
        },
    },
};
