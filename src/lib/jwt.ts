import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET belum diatur pada .env");
}

export const generateToken = (
    userId: number,
    username: string,
    role: string
): string => {
    return jwt.sign(
        {
            userId,
            username,
            role,
        },
        JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

export { JWT_SECRET };