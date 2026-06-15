export const authenticated = ({ req }) => {
    return Boolean(req.user)
}