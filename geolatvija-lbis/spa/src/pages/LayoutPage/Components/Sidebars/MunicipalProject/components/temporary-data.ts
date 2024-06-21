import { generate } from 'random-words';

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const createNewProjects = () => {
  const isCurrantYear = new Date().getFullYear();
  const statusOptions = ['supported', 'in_progress', 'realized'];
  const yearsData = [];

  // Generate data for the current year
  const currentYearData = [];
  for (let i = 0; i < 40; i++) {
    const obj = {
      id: i,
      title: generate({ exactly: 6, join: ' ' }),
      voted: i % 4 === 0 ? true : false,
      isCurrantYear: true,
      pictures: [
        `https://picsum.photos/id/${randomNumber(5, 99)}/300/300`,
        `https://picsum.photos/id/${randomNumber(5, 99)}/300/300`,
        `https://picsum.photos/id/${randomNumber(5, 99)}/300/300`,
      ],
    };
    currentYearData.push(obj);
  }

  yearsData.push({ year: 2025, projects: currentYearData });

  // // Generate data for the previous years
  // for (let year = isCurrantYear - 1; year >= isCurrantYear - 1; year--) {
  //   const yearData = [];
  //   for (let i = 0; i < 40; i++) {
  //     const obj = {
  //       id: i + 20 * (isCurrantYear - year - 1),
  //       title: generate({ exactly: 6, join: ' ' }),
  //       isCurrantYear: false,
  //       images: [
  //         `https://picsum.photos/id/${randomNumber(5, 99)}/300/300`,
  //         `https://picsum.photos/id/${randomNumber(5, 99)}/300/300`,
  //         `https://picsum.photos/id/${randomNumber(5, 99)}/300/300`,
  //       ],
  //       status: statusOptions[randomNumber(0, statusOptions.length - 1)],
  //       startDate: new Date(year, randomNumber(0, 11), randomNumber(1, 28)),
  //       endDate: new Date(year, randomNumber(0, 11), randomNumber(1, 28)),
  //     };
  //     yearData.push(obj);
  //   }
  //   yearsData.push({ year, project: yearData });
  // }

  return yearsData;
};
export interface ProjectInterface {
  id: number;
  vote_count?: number;
  name: string;
  isCurrantYear: boolean;
  has_voted: boolean;
  pictures: string[];
  state?: string;
  startDate?: Date;
  endDate?: Date;
  atvk_id: string;
}
export interface ProjectDataInterface {
  year: number;
  projects: ProjectInterface[];
}

export interface EventDataInterface {
  id: number;
  title: string;
  image: string;
}
