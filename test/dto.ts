//*Employer form */
export const employerForm = {
  info: {
    companyName: 'google',
    companyInfo: 'google-home',
    address: 'google-address',
  },
  credential: {
    email: 'abc@gmail.com',
    password: 'abcdf',
  },
}

export const employerLogin = {
  email: 'abc@gmail.com',
  password: 'abcdf',
}

export const jobPostForm = {
  title: 'Fullstack React- & Node.js Developer',
  jobDescription:
    'We create and operate the online shops of Klamotten. Your job is to participate in the further development of our existing shop system platform',
  seniority: 'Junior',
  skills: [{ id: 1 }, { id: 2 }, { id: 3 }],
}

export const updateEmployerInfo = {
  info: {
    companyName: 'Updated company name',
    companyInfo: 'Updated company info',
    address: 'Updated address',
  },
  credential: {
    email: 'Updated email',
    password: 'Updated password',
  },
}

export const updateJobPostForm = {
  update: {
    title: 'new title',
    description: 'new description',
    seniority: 'god',
    skills: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
  id: 1,
}

//**Job seeker form */
export const jobSeekerForm = {
  info: {
    firstName: 'duy',
    lastName: 'nguyen',
    contact: 1234,
    relocate: true,
    seniority: 'junior',
    startingDate: '10/12/2020',
  },
  credential: {
    email: 'abc@gmail.com',
    password: 'password',
  },
  skills: [{ id: 1 }, { id: 2 }, { id: 3 }],
}

export const jobSeekerLogin = {
  email: jobSeekerForm.credential.email,
  password: jobSeekerForm.credential.password,
}

export const skillForm = [
  {
    name: 'Javascript',
  },
  {
    name: 'Java',
  },
  {
    name: 'React',
  },
]

export const mockJobSeekerCredential = {
  id: 1,
  firstName: 'abcd',
  lastName: 'abcd',
  image: 'abcd',
  contact: 12129,
  relocate: true,
  seniority: 'junior',
  startingDate: 'today',
  role: 'job seeker',
  skills: [
    {
      id: 1,
      name: 'Javascript',
    },
    {
      id: 2,
      name: 'React',
    },
    {
      id: 3,
      name: 'Java',
    },
  ],
}

export const mockEmployerCredential = {
  id: 1,
  companyName: 'aada',
  companyInfo: 'adsasda',
  address: 'adadasd',
  role: 'employer',
}
