export default function GetAvgRating(ratingArr) {
    // console.log("GETTING RATING AVRAGE RATIG..........",ratingArr)
    if (ratingArr?.length === 0||!ratingArr) return 0
    let res = 0;
    for(let rating of ratingArr){
      res+=rating?.rating
    }

    // const totalReviewCount = ratingArr?.reduce((acc, curr) => {
    //   acc += curr.rating
    //   return acc
    // }, 0)
    // console.log("avg",totalReviewCount)
    const multiplier = Math.pow(10, 1)
    console.log("MULTIPLIER       : ",multiplier)
    const avgReviewCount =
      Math.round((res / ratingArr?.length) * multiplier) / multiplier
    console.log("RESULT AT AVG RATING..............",res,avgReviewCount);
    return avgReviewCount
  }