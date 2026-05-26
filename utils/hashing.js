import {compare, hash} from 'bcrypt';

export const passwordHash=async (password,saltValue)=>{
    const result=await hash(password,saltValue);
    return result;
}

export const passwordCompare = async (password,hashedValue)=>{
    const result=await compare(password,hashedValue)
    return result;
}

export const VerificationCodeHash=async (VerificationCode,saltValue)=>{
    const result=await hash(VerificationCode,saltValue)
    return result;
}

export const VerificationCodeCompare=async(VerificationCode,hashedValue)=>{
    const result=await compare(VerificationCode,hashedValue)
    return result;
}

