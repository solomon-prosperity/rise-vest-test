import Joi from "joi";
import { ValidationResult } from "joi";

export interface User {
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  password: string;
}

export interface Post {
  post: string;
  userId?: string;
}

export interface Comment {
  comment: string;
  userId?: string;
  postId?: string;
}

export interface Auth {
  email: string;
  password: string;
}

// validation for user signUp
export const validateUserPayload = async (user: User): Promise<ValidationResult> => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    gender: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown();
  return schema.validate(user);
};

// validation for creating a post
export const validatePostPayload = async (post: Post): Promise<ValidationResult> => {
  const schema = Joi.object({
    post: Joi.string().required(),
  }).unknown();
  return schema.validate(post);
};

// validation for creating a comment
export const validateCommentPayload = async (comment: Comment): Promise<ValidationResult> => {
  const schema = Joi.object({
    comment: Joi.string().required(),
  }).unknown();
  return schema.validate(comment);
};

// validation for signing in a user
export const validateAuthPayload = async (user: Auth): Promise<ValidationResult> => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown();
  return schema.validate(user);
};
