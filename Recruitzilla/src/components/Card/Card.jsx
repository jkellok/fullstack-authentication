import React from "react";
import "./Card.css";
const Card = () => {
  return (
    <div>
      <div class="panel">
        <div
          class="background"
          style={{
            backgroundImage: `url("https://alca.sfo2.cdn.digitaloceanspaces.com/uploads/codepen/2019/04/20/8829de75-5e07-4268-8049-f55afb72e301.png")`,
          }}
        ></div>
        <div class="text">
          <div class="location">Tokyo, Japan</div>
          <div class="title">Tokyo Infinity</div>
          <div class="author">Pawel Nolbert</div>
          <a
            class="link"
            href="https://unsplash.com/photos/4u2U8EO9OzY"
            target="_blank"
            rel="noreferrer"
          >
            View on Unsplash
          </a>
        </div>
      </div>
      
    </div>
  );
};

export default Card;
