import React, { Component } from "react";
import "./Post.scss";
import Image0 from "../Feed/Image0.png";
import Image1 from "../Feed/Image1.png";
import Image2 from "../Feed/Image2.png";
import Image3 from "../Feed/Image3.png";
import Image4 from "../Feed/Image4.png";
import Image5 from "../Feed/Image5.png";
import Background0 from "../Feed/Background0.jpg";
import Background1 from "../Feed/Background1.jpg";
import Background2 from "../Feed/Background2.jpg";
import Like from "./Like.svg";
import Dislike from "./Dislike.svg";

const backgrounds = [Background0, Background1, Background2];
const images = [Image0, Image1, Image2, Image3, Image4, Image5];

export default class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: this.props.feedItems[parseInt(this.props.match.params.id)],
      postID: parseInt(this.props.match.params.id),
      imageValid: false,
    };
    this.submitComment = this.submitComment.bind(this);
    this.likeDislike = this.likeDislike.bind(this);
  }

  componentDidMount() {
    this.props.loggedIn &&
      this.commentRef.addEventListener("keypress", (keypress) => {
        if (keypress.key === "Enter") {
          this.submitComment();
        }
      });
  }
  async submitComment() {
    const feedItemsCopy = this.props.feedItems.map((feedItem, index) => {
      if (index === this.state.postID) {
        const newComments = [
          ...feedItem.comments,
          { comment: this.commentRef.value, author: this.props.userName },
        ];
        const newItem = { ...feedItem, comments: newComments };
        return newItem;
      }
      return feedItem;
    });
    if (this.commentRef.value.length > 0) {
      localStorage.setItem("feed", JSON.stringify(feedItemsCopy));
      this.props.setFeedData(feedItemsCopy);
      this.setState({ post: feedItemsCopy[this.state.postID] });
      this.commentRef.value = "";
      this.firstCommentRef.scrollIntoView();
      this.commentRef.blur();
    }
  }

  likeDislike(likeStatus) {
    return () => {
      const postLikedCopy = this.props.feedItems[this.state.postID].likedby.map(
        (item, index) => {
          const newItem = { ...item };
          return newItem;
        }
      );

      if (this.props.loggedIn) {
        const foundLike = postLikedCopy.find((like, index) => {
          if (like.name === this.props.userName) {
            postLikedCopy[index].likestatus = likeStatus;
            return like;
          }
          return null;
        });
        const newPostLikedCopy = !foundLike
          ? [
              ...postLikedCopy,
              {
                image: this.props.image,
                name: this.props.userName,
                likestatus: likeStatus,
              },
            ]
          : postLikedCopy;

        const feedItemsCopy = this.props.feedItems.map((item, index) => {
          if (index === this.state.postID) {
            const newItem = { ...item, likedby: newPostLikedCopy };
            return newItem;
          }
          return item;
        });
        localStorage.setItem("feed", JSON.stringify(feedItemsCopy));
        this.props.setFeedData(feedItemsCopy);
        this.setState({ post: feedItemsCopy[this.state.postID] });
      }
    };
  }

  render() {
    const postID = this.state.postID;
    const post = this.state.post;
    const reversedComments = [...post.comments].reverse();

    const likes = post.likedby.reduce((sum, like) => {
      return like.likestatus === "like" ? sum + 1 : (sum -= 1);
    }, 0);

    return (
      <React.Fragment>
        <div>
          {!localStorage.feed[postID] || !localStorage.feed ? (
            <div className="postNotFound"> Post with given ID doesnt exist</div>
          ) : (
            <div
              className="feedItem"
              style={{
                backgroundImage: `url(${
                  postID < 3 ? backgrounds[postID] : post.background
                }),url('https://img.freepik.com/free-vector/abstract-technology-particle-background_52683-25766.jpg?size=626&ext=jpg')`,
              }}
            >
              <div className="upperPost">
                <div className="linearGrad"></div>
                <div className="title">{post.title}</div>
              </div>
              <div className="lower">
                <div style={{ fontSize: "1.2rem" }} className="postFullText">
                  {post.post}
                </div>
                <div className="authorDate">
                  <div className="author">
                    By <span className="name">{post.author}</span>
                  </div>
                  <div className="date">{post.date}</div>
                </div>
                <div className="likes">
                  <div className="likedBy">
                    {postID < 3 ? (
                      <React.Fragment>
                        <img
                          className="likeImages"
                          alt="likedBy"
                          src={postID < 3 ? images[2 * postID] : null}
                        ></img>
                        <img
                          className="likeImages"
                          alt="likedBy"
                          src={postID < 3 ? images[2 * postID + 1] : null}
                        ></img>
                      </React.Fragment>
                    ) : (
                      post.likedby.map((likedBy, index) => {
                        return (
                          <img
                            key={index}
                            className="likeImages"
                            alt="likedBy"
                            src={likedBy.image}
                          ></img>
                        );
                      })
                    )}
                    <div className="likeCount">
                      {likes - 1 >= 0 ? "+" : null}
                      {likes}
                    </div>
                    <span className="likedThis">
                      {" "}
                      {likes - 1 >= 0 ? "Liked this" : "Disliked this"}
                    </span>
                  </div>
                  {this.props.loggedIn ? (
                    <div className="likePost">
                      <img
                        alt="like"
                        className="likeImage"
                        height="20px"
                        width="20px"
                        src={Like}
                        onClick={this.likeDislike("like")}
                      ></img>
                      <img
                        alt="Dislike"
                        className="likeImage"
                        height="20px"
                        width="20px"
                        src={Dislike}
                        onClick={this.likeDislike("dislike")}
                      ></img>
                    </div>
                  ) : (
                    <div className="youNeedToLogIn"> Please Log In to Like</div>
                  )}
                </div>
              </div>

              <div className="postComments">
                <div className="commentsTitle">Comments</div>
                {this.props.loggedIn ? (
                  <div className="comment">
                    <div className="commentCont">
                      <textarea
                        ref={(elem) => {
                          this.commentRef = elem;
                        }}
                        className="commentText"
                      ></textarea>
                    </div>
                    <div className="submitComment">
                      <button
                        onClick={this.submitComment}
                        className="submitCommentButton"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ margin: "auto" }} className="youNeedToLogIn">
                    You need to Log In to be able to Comment
                  </div>
                )}
                {reversedComments.map((comment, index) => {
                  return (
                    <div
                      key={index}
                      ref={
                        index === 0
                          ? (elem) => {
                              this.firstCommentRef = elem;
                            }
                          : null
                      }
                      className="individualComment"
                    >
                      <div>{comment.comment}</div>
                      <div className="commentAuthor">{comment.author}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}
