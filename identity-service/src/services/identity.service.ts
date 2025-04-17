import { User } from "@/models/User.model";
import { UserLoginData, UserRegistrationData } from "@/utils";


export const registerUserService = async (data: UserRegistrationData) => {
    const {username, password, email} = data;
    
    const newUser = new User({
        username,
        password,
        email,
        lastLogin: Date.now(),
    })
    await newUser.save();
    
    return {
        id: newUser?._id?.toString(),
        username: newUser?.username,
        email: newUser?.email,
    };
}

export const loginUserService = async (data: UserLoginData) => {
    const {email, password} = data;
    const user = await User.findOne({email});

    if(!user) return null;
    
    
    if(!(await user.comparePassword(password))) return null;

    user.lastLogin = new Date(Date.now());
    await user.save();

    return {
        id: user?._id?.toString(),
        username: user?.username,
        email: user?.email,
    };
}

export const fetchUserByEmailOrUsername = async (email: string, username: string) => {
    const user = await User.findOne({$or: [{email}, {username}]});
    return user;
} 

export const fetchUserById = async (id: string) => {
    const user = await User.findById(id);
    return user;
}

