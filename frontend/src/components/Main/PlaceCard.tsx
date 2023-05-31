import styles from "./PlaceCard.module.css";
import React from "react";
import { ITopTenPlace } from "@/src/interfaces/Place";
import Image from "next/image";
import FiveStarRating from "../FiveStarRating/FiveStarRating";
import { useRouter } from "next/router";
import TagItem from "../UI/TagItem";
import { FaMapMarkerAlt } from "react-icons/fa";

const PlaceCard = ({
  placeId,
  name,
  region,
  firstImage,
  averageRating,
}: ITopTenPlace) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/place/${placeId}`);
  };
  return (
    <div className={styles["place-card-container"]} onClick={handleCardClick}>
      <div className={styles["place-image-container"]}>
        <div className={styles["card-tag"]}>
          {region && (
            <TagItem
              color="MMint"
              size="SS"
              text={region}
              bgColor="white"
              isBorder={true}
              icon={<FaMapMarkerAlt />}
            />
          )}
        </div>
        <Image src={firstImage} alt={name} width={320} height={320} priority />
      </div>
      <div className={styles["place-card-content"]}>
        <h3 className={styles["card-name"]}>{name}</h3>
        <FiveStarRating rating={averageRating} />
      </div>
    </div>
  );
};

export default PlaceCard;
