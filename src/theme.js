import { createTheme } from '@mui/material/styles';

// Mobile App Color Palette - matches servis_now_driver_mobile & servis_now_veli_mobile
const colors = {
    primary: '#073662',      // Koyu Lacivert
    accent: '#18A1D8',       // Açık Mavi
    background: '#F4F6F8',   // Arka Plan
    surface: '#FFFFFF',      // Beyaz yüzey
    textPrimary: '#073662',  // Koyu metin
    textSecondary: '#637381', // Gri metin
    error: '#FF4842',        // Kırmızı
    success: '#22C55E',      // Yeşil
    warning: '#FFAB00',      // Sarı
    info: '#18A1D8',         // Mavi
};

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: colors.primary,
            light: '#1a5a9c',
            dark: '#042545',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: colors.accent,
            light: '#4fb8e3',
            dark: '#1183b5',
            contrastText: '#FFFFFF',
        },
        background: {
            default: colors.background,
            paper: colors.surface,
        },
        text: {
            primary: colors.textPrimary,
            secondary: colors.textSecondary,
        },
        error: {
            main: colors.error,
            light: '#FF7B73',
            dark: '#B72136',
        },
        success: {
            main: colors.success,
            light: '#54D62C',
            dark: '#229A16',
        },
        warning: {
            main: colors.warning,
            light: '#FFD333',
            dark: '#B76E00',
        },
        info: {
            main: colors.info,
            light: colors.accent,
            dark: '#1183b5',
        },
        divider: 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.3,
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.4,
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.5,
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        subtitle1: {
            fontWeight: 500,
            fontSize: '1rem',
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: '0.875rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.57,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0px 1px 2px rgba(0, 0, 0, 0.06)',
        '0px 1px 4px rgba(0, 0, 0, 0.08)',
        '0px 2px 8px rgba(0, 0, 0, 0.08)',
        '0px 4px 12px rgba(0, 0, 0, 0.10)',
        '0px 6px 16px rgba(0, 0, 0, 0.12)',
        '0px 8px 20px rgba(0, 0, 0, 0.14)',
        '0px 10px 24px rgba(0, 0, 0, 0.16)',
        '0px 12px 28px rgba(0, 0, 0, 0.18)',
        '0px 14px 32px rgba(0, 0, 0, 0.20)',
        '0px 16px 36px rgba(0, 0, 0, 0.22)',
        '0px 18px 40px rgba(0, 0, 0, 0.24)',
        '0px 20px 44px rgba(0, 0, 0, 0.26)',
        '0px 22px 48px rgba(0, 0, 0, 0.28)',
        '0px 24px 52px rgba(0, 0, 0, 0.30)',
        '0px 26px 56px rgba(0, 0, 0, 0.32)',
        '0px 28px 60px rgba(0, 0, 0, 0.34)',
        '0px 30px 64px rgba(0, 0, 0, 0.36)',
        '0px 32px 68px rgba(0, 0, 0, 0.38)',
        '0px 34px 72px rgba(0, 0, 0, 0.40)',
        '0px 36px 76px rgba(0, 0, 0, 0.42)',
        '0px 38px 80px rgba(0, 0, 0, 0.44)',
        '0px 40px 84px rgba(0, 0, 0, 0.46)',
        '0px 42px 88px rgba(0, 0, 0, 0.48)',
        '0px 44px 92px rgba(0, 0, 0, 0.50)',
    ],
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: `${colors.accent} ${colors.background}`,
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        width: 8,
                        height: 8,
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        borderRadius: 8,
                        backgroundColor: colors.accent,
                    },
                    '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
                        borderRadius: 8,
                        backgroundColor: colors.background,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 20px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(7, 54, 98, 0.2)',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(7, 54, 98, 0.3)',
                    },
                },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${colors.primary} 0%, #1a5a9c 100%)`,
                    '&:hover': {
                        background: `linear-gradient(135deg, #042545 0%, ${colors.primary} 100%)`,
                    },
                },
                containedSecondary: {
                    background: `linear-gradient(135deg, ${colors.accent} 0%, #4fb8e3 100%)`,
                    '&:hover': {
                        background: `linear-gradient(135deg, #1183b5 0%, ${colors.accent} 100%)`,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                },
                elevation1: {
                    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.08)',
                },
                elevation2: {
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                },
                elevation3: {
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.10)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                    '&:hover': {
                        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        backgroundColor: colors.background,
                        fontWeight: 600,
                        color: colors.primary,
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(24, 161, 216, 0.04)',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.accent,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.primary,
                        },
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                    boxShadow: '0px 24px 48px rgba(0, 0, 0, 0.16)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
                colorPrimary: {
                    backgroundColor: 'rgba(7, 54, 98, 0.12)',
                    color: colors.primary,
                },
                colorSecondary: {
                    backgroundColor: 'rgba(24, 161, 216, 0.12)',
                    color: colors.accent,
                },
                colorSuccess: {
                    backgroundColor: 'rgba(34, 197, 94, 0.12)',
                    color: colors.success,
                },
                colorError: {
                    backgroundColor: 'rgba(255, 72, 66, 0.12)',
                    color: colors.error,
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
                standardSuccess: {
                    backgroundColor: 'rgba(34, 197, 94, 0.12)',
                    color: '#118D57',
                },
                standardError: {
                    backgroundColor: 'rgba(255, 72, 66, 0.12)',
                    color: '#B72136',
                },
                standardWarning: {
                    backgroundColor: 'rgba(255, 171, 0, 0.12)',
                    color: '#B76E00',
                },
                standardInfo: {
                    backgroundColor: 'rgba(24, 161, 216, 0.12)',
                    color: '#1183b5',
                },
            },
        },
        MuiTablePagination: {
            styleOverrides: {
                root: {
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    margin: '2px 8px',
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(24, 161, 216, 0.12)',
                        '&:hover': {
                            backgroundColor: 'rgba(24, 161, 216, 0.16)',
                        },
                    },
                },
            },
        },
    },
});

export default theme;
export { colors };
