export interface Alumni {
    id: number;
    name: string;
    image: string;
    company: string;
    batch: number;
    branch: string;
    story: string;
    linkedin: string
  }
  
  export const alumniData: Alumni[] = [
    {
      id: 1,
      name: "Mahak",
      image: "/mahak.jpg",
      branch: "CSEAI",
      batch:2027,
      company: "Google STEP",
      linkedin: "https://www.linkedin.com/in/janesmith",
      story: "John Doe graduated in 2015 and went on to found a successful tech startup that was acquired for $50 million in 2020.John Doe graduated in 2015 and went on to found a successful tech startup that was acquired for $50 million in 2020.John Doe graduated in 2015 and went on to found a successful tech startup that was acquired for $50 million in 2020.John Doe graduated in 2015 and went on to found a successful tech startup that was acquired for $50 million in 2020.John Doe graduated in 2015 and went on to found a successful tech startup that was acquired for $50 million in 2020.John Doe graduated in 2015 and went on to found a successful tech startup that was acquired for $50 million in 2020."
    },
    {
      id: 2,
      name: "Jane Smith",
      image: "/placeholder.svg?height=200&width=200",
      branch: "Electrical Engineering",
      batch:2027,
      company: "Google STEP",
      linkedin: "https://www.linkedin.com/in/janesmith",
      story: "Jane Smith is now the CTO of a Fortune 500 company, leading innovation in renewable energy technologies."
    },
    {
      id: 3,
      name: "Alex Johnson",
      image: "/placeholder.svg?height=200&width=200",
      branch: "Mechanical Engineering",
      batch:2027,
      company: "Google STEP",
      linkedin: "https://www.linkedin.com/in/janesmith",
      story: "Alex Johnson's research in robotics has led to groundbreaking advancements in prosthetic limb technology."
    },
    // Add more alumni data as needed
  ];
  
  