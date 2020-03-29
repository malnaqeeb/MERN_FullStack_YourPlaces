const { validationResult } = require("express-validator");

const Comment = require('../model/comment');
const HttpError = require("../model/http-error");

const getComments = async (req, res, next) => {
    try{
        const comments = await Comment.find({placeId: req.params.pid})
        .populate(
            {
                path: "creator",
                select: 'name image'
            }
        )
        .exec();
        res.json({comments});
    } catch {
        return next(new HttpError('Something went wrong, could not find comments for the place.', 500));
    }
}

const createComment = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()){
        return next(new Error('Invalid input passed, please check your data.', 422));
    }
      
    try{
        const placeId = req.params.pid;
        const creator = req.userData.userId;
        const comment = req.body.comment;
        const title = req.body.title;
        const createdComment = await Comment.create({placeId ,creator, title, comment});
        const doc = await Comment.findOne(createdComment)
        .populate(
            {
                path: "creator",
                select: 'name image'
            }
        )
        .exec();
        res.json({comment: doc});
    } catch (e) {
        console.log(e);
        return next(new HttpError('Something went wrong, could not create comment.', 500));
    }
}

const updateComment = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()){
        return next(new Error('Invalid input passed, please check your data.', 422));
    }

    let comment
    try{
        comment = await Comment.findById(req.params.cid).exec();
    } catch {
        return next(new HttpError('Something went wrong, could not update the comment with the provided id', 500));
    }

    if(!comment){
        return next(new HttpError('Can not update a comment that does not exist.', 404));
    }

    if(comment.creator.toString() !== req.userData.userId){
        return next(new HttpError('Not authorized to update the given comment!', 401));
    }

    try{
        comment.comment = req.body.comment;
        comment.title = req.body.title;
        await comment.save();
    } catch {
        return next(new HttpError('Something went wrong, could not update the comment with the provided id', 500));
    }

    res.json({comment});
}

const deleteComment = async (req, res, next) => {
    let comment
    
    try{
        comment = await Comment.findById(req.params.cid).exec();
    } catch {
        return next(new HttpError('Something went wrong, could not delete the comment with the provided id', 500));
    }

    if(!comment){
        return next(new HttpError('Can not delete a comment that does not exist.', 404));
    }

    if(comment.creator.toString() !== req.userData.userId){
        return next(new HttpError('Not authorized to delete the given comment!', 401));
    }

    try{
        await Comment.deleteOne(comment);
    } catch {
        return next(new HttpError('Something went wrong, could not update the comment with the provided id', 500));
    }

    res.json({message: "Deleted"});
}

module.exports = {getComments, createComment, updateComment, deleteComment};