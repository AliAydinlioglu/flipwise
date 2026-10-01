export const gradients = {
  primary: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  secondary: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",

  pageBackground: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #581c87 50%, #7c2d12 75%, #dc2626 100%)",
  pageBackgroundLight: "linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 25%, #fef3c7 50%, #fed7aa 75%, #fecaca 100%)",

  cardDark: "linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(118, 75, 162, 0.2) 50%, rgba(102, 126, 234, 0.1) 100%)",
  cardLight: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(227, 242, 253, 0.8) 50%, rgba(187, 222, 251, 0.6) 100%)",

  hoverDark: "linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(118, 75, 162, 0.3) 50%, rgba(102, 126, 234, 0.2) 100%)",
  hoverLight: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(227, 242, 253, 0.9) 50%, rgba(187, 222, 251, 0.8) 100%)",

  buttonDark: "linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(118, 75, 162, 0.3) 100%)",
  buttonLight: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(227, 242, 253, 0.7) 100%)",
};

export const transitions = {
  smooth: "all 0.3s ease",
  spring: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  bounce: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
};

export const borders = {
  cardDark: "1px solid rgba(0, 210, 255, 0.2)",
  cardLight: "1px solid rgba(21, 101, 192, 0.3)",
};

export const getCardStyles = (darkMode, variant = "default") => ({
  background: darkMode ? gradients.cardDark : gradients.cardLight,
  border: darkMode ? borders.cardDark : borders.cardLight,
  backdropFilter: "blur(15px)",
  transition: transitions.spring,
  "&:hover": {
    background: darkMode ? gradients.hoverDark : gradients.hoverLight,
  },
});

export const cardStyles = {
  glass: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },

  glassDark: {
    background: "rgba(30, 30, 30, 0.8)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
  },

  glassLight: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
  },
};
