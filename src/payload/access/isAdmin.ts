export const isAdmin = ({ req }) => {
    return req.user?.role === "admin"
}