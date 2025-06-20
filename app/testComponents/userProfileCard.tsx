// import * as React from 'react';
// import { Card, CardContent, CardMedia, Typography, Avatar, Box, Chip } from '@mui/material';
// import { styled } from '@mui/material/styles';

// // Styled Card component with Tailwind classes for additional styling
// const ProfileCard = styled(Card)({
//   maxWidth: 345,
//   margin: 'auto',
//   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//   borderRadius: '12px',
//   overflow: 'hidden',
//   backgroundColor: '#fff',
// });

// // Styled Avatar with Tailwind classes
// const StyledAvatar = styled(Avatar)({
//   width: 100,
//   height: 100,
//   margin: 'auto',
//   border: '4px solid #fff',
//   boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
// });

// const UserProfileCard = ({ user }) => {
//   const defaultUser = {
//     name: 'John Doe',
//     bio: 'Passionate developer and coffee enthusiast. Always learning and building cool stuff!',
//     avatar: 'https://via.placeholder.com/150',
//     stats: {
//       followers: 120,
//       following: 85,
//       posts: 42,
//     },
//   };

//   const { name, bio, avatar, stats } = user || defaultUser;

//   return (
//     <ProfileCard className="mt-8">
//       <Box className="relative">
//         <CardMedia
//           component="img"
//           height="140"
//           image="https://via.placeholder.com/345x140"
//           alt="Profile background"
//           className="object-cover"
//         />
//         <Box className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
//           <StyledAvatar alt={name} src={avatar} />
//         </Box>
//       </Box>
//       <CardContent className="pt-16 text-center">
//         <Typography variant="h5" component="div" className="font-bold text-gray-800">
//           {name}
//         </Typography>
//         <Typography variant="body2" color="text.secondary" className="mt-2 mb-4">
//           {bio}
//         </Typography>
//         <Box className="flex justify-center gap-4">
//           <Chip
//             label={`${stats.followers} Followers`}
//             variant="outlined"
//             className="text-sm"
//           />
//           <Chip
//             label={`${stats.following} Following`}
//             variant="outlined"
//             className="text-sm"
//           />
//           <Chip
//             label={`${stats.posts} Posts`}
//             variant="outlined"
//             className="text-sm"
//           />
//         </Box>
//       </CardContent>
//     </ProfileCard>
//   );
// };

// export default UserProfileCard;