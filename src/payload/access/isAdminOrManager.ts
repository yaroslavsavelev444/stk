export const isAdminOrManager = ({ req }) => {
    return req.user?.role === "admin" || req.user?.role === "manager"
}