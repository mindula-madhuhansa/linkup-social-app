import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
  try {
    // Upload image
    if (post.file && typeof post.file == "object") {
      let isImage = post?.file?.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";

      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);

      if (fileResult.success) {
        post.file = fileResult.data;
      } else {
        return fileResult;
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.error("create post error", error);
      return { success: false, msg: "Could not create post" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("create post error", error);
    return { success: false, msg: "Could not create post" };
  }
};

export const fetchPosts = async (limit = 10, userId) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
        *,
       user: users (id, name, image),
       postLikes (*),
        comments (count)
        `
        )
        .order("created_at", { ascending: false })
        .eq("userId", userId)
        .limit(limit);

      if (error) {
        console.error("fetch post error", error);
        return { success: false, msg: "Could not fetch the posts" };
      }

      return { success: true, data };
    } else {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
        *,
       user: users (id, name, image),
       postLikes (*),
        comments (count)
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("fetch post error", error);
        return { success: false, msg: "Could not fetch the posts" };
      }

      return { success: true, data };
    }
  } catch (error) {
    console.error("fetch post error", error);
    return { success: false, msg: "Could not fetch the posts" };
  }
};

export const fetchPostDetails = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
       user: users (id, name, image),
       postLikes (*),
        comments (*, user: users(id, name, image))
        `
      )
      .eq("id", postId)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();

    if (error) {
      console.error("fetch post details error", error);
      return { success: false, msg: "Could not fetch the post details" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("fetch post details error", error);
    return { success: false, msg: "Could not fetch the post details" };
  }
};

export const createPostLike = async (postLike) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.error("post like error", error);
      return { success: false, msg: "Could not like the posts" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("post like error", error);
    return { success: false, msg: "Could not like the posts" };
  }
};

export const removePostLike = async (userId, postId) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      console.error("remove post like error", error);
      return { success: false, msg: "Could not remove like the posts" };
    }

    return { success: true };
  } catch (error) {
    console.error("remove post like error", error);
    return { success: false, msg: "Could not remove like the posts" };
  }
};

export const createComment = async (comment) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.error("comment error", error);
      return { success: false, msg: "Could not add your comment" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("comment error", error);
    return { success: false, msg: "Could not add your comment" };
  }
};

export const removeComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("remove comment like error", error);
      return { success: false, msg: "Could not remove the comment" };
    }

    return { success: true, data: { commentId } };
  } catch (error) {
    console.error("remove comment like error", error);
    return { success: false, msg: "Could not remove the comment" };
  }
};

export const removePost = async (postId) => {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.error("remove post error", error);
      return { success: false, msg: "Could not remove the post" };
    }

    return { success: true, data: { postId } };
  } catch (error) {
    console.error("remove post error", error);
    return { success: false, msg: "Could not remove the post" };
  }
};
