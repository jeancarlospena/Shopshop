import { Rating } from "react-simple-star-rating";

const RatingDisplay = ({ rating }) => {
  return (
    <Rating
      initialValue={rating}
      readonly={true}
      size={15}
      allowFraction={true}
    />
  );
};

export default RatingDisplay;
