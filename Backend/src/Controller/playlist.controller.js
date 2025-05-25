import mongoose, { isValidObjectId, Mongoose, } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.models.js";

//Api creating
//to create a playlist
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if ([name, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const playlist = await Playlist.create({
    name: name,
    description: description,
    owner: req.user._id,
  });
  if (!playlist) {
    throw new ApiError(500, "Playlist not Created!TRY AGAIN!");
  }

  res.status(200).json(new ApiResponse(200, playlist, "Playlist Created"));
}); //need testing //edit: its tested working okay
