export type FavoriteTutorState = {
    list: GetAllFavoriteTutor[] | null;
    isFavorited: CheckFavoriteTutorRessponse | null;
};

export type CheckFavoriteTutorRessponse = {
    isFavorited: boolean;
};

export type GetAllFavoriteTutor = {
    id: StatementResultingChanges;
    tutorProfileId: string;
    tutorUserId: string;
    tutorName: string;
    tutorAvatar: string;
    tutorBio: string;
    tutorRating: number | null;
    favoritedAt: string;
};
