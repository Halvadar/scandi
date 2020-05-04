import React, { Component } from "react";
import "./Post.scss";
import image0 from "../Feed/image0.png";
import image1 from "../Feed/image1.png";
import image2 from "../Feed/image2.png";
import image3 from "../Feed/image3.png";
import image4 from "../Feed/image4.png";
import image5 from "../Feed/image5.png";
import background0 from "../Feed/Background0.jpg";
import background1 from "../Feed/Background1.jpg";
import background2 from "../Feed/Background2.jpg";
import Arrow from "../Statistics/Arrow.svg";
import like from "./like.svg";
import dislike from "./dislike.svg";

const backgrounds = [background0, background1, background2];
const images = [image0, image1, image2, image3, image4, image5];

export default class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: this.props.FeedItems[parseInt(this.props.match.params.id)],
      postID: parseInt(this.props.match.params.id),
    };
    this.SubmitComment = this.SubmitComment.bind(this);
    this.LikeDislike = this.LikeDislike.bind(this);
  }

  componentDidMount() {
    this.props.LoggedIn &&
      this.CommentRef.addEventListener("keypress", (a) => {
        if (a.key === "Enter") {
          this.SubmitComment();
        }
      });
  }
  async SubmitComment() {
    const FeedItemsCopy = this.props.FeedItems.map((item, index) => {
      if (index === this.state.postID) {
        const NewComments = [
          ...item.comments,
          { comment: this.CommentRef.value, author: this.props.UserName },
        ];
        const NewItem = { ...item, comments: NewComments };
        return NewItem;
      }
      return item;
    });
    if (this.CommentRef.value.length > 0) {
      localStorage.setItem("Feed", JSON.stringify(FeedItemsCopy));
      this.props.SetFeedData(FeedItemsCopy);
      this.setState({ post: FeedItemsCopy[this.state.postID] });
      this.CommentRef.value = "";
      this.FirstCommentRef.scrollIntoView();
      this.CommentRef.blur();
      console.log(2);
    }
  }
  LikeDislike(a) {
    return () => {
      const PostLikedCopy = this.props.FeedItems[this.state.postID].likedby.map(
        (item, index) => {
          const NewItem = { ...item };
          return NewItem;
        }
      );
      let NewPostLikedCopy;

      if (this.props.LoggedIn) {
        const FoundLike = PostLikedCopy.find((like, index) => {
          if (like.name === this.props.UserName) {
            PostLikedCopy[index].likestatus = a;
            return like;
          }
          return null;
        });
        if (!FoundLike) {
          NewPostLikedCopy = [
            ...PostLikedCopy,
            {
              image: this.props.Image,
              name: this.props.UserName,
              likestatus: a,
            },
          ];
        } else {
          NewPostLikedCopy = PostLikedCopy;
        }
        const FeedItemsCopy = this.props.FeedItems.map((item, index) => {
          if (index === this.state.postID) {
            const NewItem = { ...item, likedby: NewPostLikedCopy };
            return NewItem;
          }
          return item;
        });
        localStorage.setItem("Feed", JSON.stringify(FeedItemsCopy));
        this.props.SetFeedData(FeedItemsCopy);
        this.setState({ post: FeedItemsCopy[this.state.postID] });
      }
    };
  }

  render() {
    const postID = this.state.postID;
    const post = this.state.post;
    const reversedcomments = [...post.comments].reverse();

    let likes = 0;
    post.likedby.forEach((a) => {
      if (a.likestatus === "like") {
        likes++;
      } else {
        likes -= 1;
      }
    });

    return (
      <React.Fragment>
        <div
          onClick={() => {
            this.props.history.push("/feed");
          }}
          className="AuthenticationGoBack"
        >
          <img src={Arrow} alt="GoBack" className="GoBack"></img>
        </div>

        <div>
          {!localStorage.Feed[postID] || !localStorage.Feed ? (
            <div className="PostNotFound"> Post with given ID doesnt exist</div>
          ) : (
            <div
              className="FeedItem"
              style={{
                backgroundImage: `url(${
                  postID < 3 ? backgrounds[postID] : post.background
                })`,
              }}
            >
              <div className="UpperPost">
                <div className="LinearGrad"></div>
                <div className="Title">{post.title}</div>
              </div>
              <div className="Lower">
                <div style={{ fontSize: "1.2rem" }} className="PostFullText">
                  {post.post}
                </div>
                <div className="AuthorDate">
                  <div className="Author">
                    By <span className="Name">{post.author}</span>
                  </div>
                  <div className="Date">{post.date}</div>
                </div>
                <div className="Likes">
                  <div className="LikedBy">
                    {postID < 3 ? (
                      <React.Fragment>
                        <img
                          className="LikeImages"
                          alt="LikedBy"
                          src={postID < 3 ? images[2 * postID] : null}
                        ></img>
                        <img
                          className="LikeImages"
                          alt="LikedBy"
                          src={postID < 3 ? images[2 * postID + 1] : null}
                        ></img>
                      </React.Fragment>
                    ) : (
                      post.likedby.map((a, b) => {
                        return (
                          <img
                            key={b}
                            className="LikeImages"
                            alt="LikedBy"
                            src={a.image}
                          ></img>
                        );
                      })
                    )}
                    <div className="LikeCount">
                      {likes - 1 >= 0 ? "+" : null}
                      {likes}
                    </div>
                    <span className="LikedThis">
                      {" "}
                      {likes - 1 >= 0 ? "Liked this" : "Disliked this"}
                    </span>
                  </div>
                  {this.props.LoggedIn ? (
                    <div className="LikePost">
                      <img
                        alt="Like"
                        className="LikeImage"
                        height="20px"
                        width="20px"
                        src={like}
                        onClick={this.LikeDislike("like")}
                      ></img>
                      <img
                        alt="Dislike"
                        className="LikeImage"
                        height="20px"
                        width="20px"
                        src={dislike}
                        onClick={this.LikeDislike("dislike")}
                      ></img>
                    </div>
                  ) : (
                    <div className="YouNeedToLogIn"> Please Log In to Like</div>
                  )}
                </div>
              </div>

              <div className="PostComments">
                <div className="CommentsTitle">Comments</div>
                {this.props.LoggedIn ? (
                  <div className="Comment">
                    <div className="CommentCont">
                      <textarea
                        ref={(a) => {
                          this.CommentRef = a;
                        }}
                        className="CommentText"
                      ></textarea>
                    </div>
                    <div className="SubmitComment">
                      <button
                        onClick={this.SubmitComment}
                        className="SubmitCommentButton"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ margin: "auto" }} className="YouNeedToLogIn">
                    You need to Log In to be able to Comment
                  </div>
                )}
                {reversedcomments.map((a, b) => {
                  return (
                    <div
                      key={b}
                      ref={
                        b === 0
                          ? (r) => {
                              this.FirstCommentRef = r;
                            }
                          : null
                      }
                      className="IndividualComment"
                    >
                      <div>{a.comment}</div>
                      <div className="CommentAuthor">{a.author}</div>
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
