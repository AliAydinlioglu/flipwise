import { Box, Typography, Grid, Card, CardContent, Fade } from "@mui/material";
import { School, Folder, Quiz, Share, Devices } from "@mui/icons-material";
import { gradients } from "../constants";

const About = () => {
  const features = [
    {
      icon: <Folder sx={{ fontSize: 40, color: "#667eea" }} />,
      title: "Organize Your Study Materials",
      description: "Create folders to keep your flashcards organized by subject or topic.",
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: "#764ba2" }} />,
      title: "Interactive Flashcards",
      description: "Study with flip cards that help you memorize questions and answers effectively.",
    },
    {
      icon: <Share sx={{ fontSize: 40, color: "#667eea" }} />,
      title: "Share with Friends",
      description: "Make your folders public so classmates can study from your flashcards too.",
    },
    {
      icon: <School sx={{ fontSize: 40, color: "#764ba2" }} />,
      title: "Study Anywhere",
      description: "Access your flashcards from any device - perfect for studying on the go.",
    },
    {
      icon: <Devices sx={{ fontSize: 40, color: "#f093fb" }} />,
      title: "Easy to Use",
      description: "Simple interface that makes creating and studying flashcards quick and fun.",
    },
  ];

  return (
    <>
      {/* Full-screen background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: gradients.primary,
          zIndex: -1,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
            animation: "float 6s ease-in-out infinite",
          },
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 1, py: 4 }}>
        {/* Header */}
        <Fade
          in
          timeout={1000}
        >
          <Box
            textAlign="center"
            sx={{ mb: 6 }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                mb: 3,
                background: "linear-gradient(45deg, #ffffff 30%, #f0f8ff 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              About FlipWise
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.95,
                color: "white",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                textShadow: "0 1px 5px rgba(0,0,0,0.3)",
              }}
            >
              A simple flashcard app to help students study better
            </Typography>
          </Box>
        </Fade>

        {/* Why I Built This */}
        <Fade
          in
          timeout={1500}
        >
          <Card
            sx={{
              mb: 6,
              borderRadius: "20px",
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: "center" }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ color: "white", fontWeight: "bold", mb: 3 }}
              >
                Why I Built This App
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.8,
                  maxWidth: 700,
                  mx: "auto",
                }}
              >
                As a student, I know how hard it can be to study effectively. I created FlipWise to make studying with flashcards easier and more organized. Whether you&apos;re preparing for exams or
                just trying to learn new concepts, this app helps you study smarter, not harder.
              </Typography>
            </CardContent>
          </Card>
        </Fade>

        {/* Features */}
        <Fade
          in
          timeout={2000}
        >
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              textAlign="center"
              gutterBottom
              sx={{
                color: "white",
                fontWeight: "bold",
                mb: 4,
                fontSize: { xs: "2rem", md: "3rem" },
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              What Can You Do?
            </Typography>
            <Grid
              container
              spacing={3}
              justifyContent="center"
            >
              {features.map((feature, index) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={index === 2 || index === 3 ? 6 : 4}
                  key={index}
                  sx={index === 2 || index === 3 ? { display: "flex", justifyContent: "center" } : {}}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "20px",
                      backdropFilter: "blur(20px)",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* How to Get Started */}
        <Fade
          in
          timeout={2500}
        >
          <Card
            sx={{
              borderRadius: "20px",
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: "center" }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ color: "white", fontWeight: "bold" }}
              >
                How to Get Started
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  mb: 3,
                  maxWidth: 600,
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                1. Create an account or log in
                <br />
                2. Make a new folder for your subject
                <br />
                3. Add flashcards with questions and answers
                <br />
                4. Start studying!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  fontStyle: "italic",
                }}
              >
                It&apos;s that simple! Happy studying! 📚
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </>
  );
};

export default About;
