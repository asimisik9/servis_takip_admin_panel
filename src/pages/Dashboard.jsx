import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  alpha,
  Skeleton
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { fetchUsers } from '../services/userService';
import { fetchStudents } from '../services/studentService';
import { fetchSchools } from '../services/schoolService';
import { fetchBuses } from '../services/busService';
import { fetchOrganizations } from '../services/organizationService';
import { getUser } from '../services/authService';

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <Card
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
      border: `1px solid ${alpha(color, 0.2)}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 24px ${alpha(color, 0.15)}`,
        border: `1px solid ${alpha(color, 0.3)}`,
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            {title}
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={60} height={48} />
          ) : (
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color,
                mt: 0.5,
              }}
            >
              {value}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
            boxShadow: `0 4px 14px ${alpha(color, 0.4)}`,
          }}
        >
          <Icon sx={{ fontSize: 28, color: 'white' }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    students: 0,
    schools: 0,
    buses: 0,
    organizations: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = getUser();
  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    const loadStats = async () => {
      try {
        const promises = [
          fetchUsers(0, 1).catch(() => ({ total: 0 })),
          fetchStudents(0, 1).catch(() => ({ total: 0 })),
          fetchSchools(0, 1).catch(() => ({ total: 0 })),
          fetchBuses(0, 1).catch(() => ({ total: 0 })),
        ];
        if (isSuperAdmin) {
          promises.push(fetchOrganizations(0, 1).catch(() => ({ total: 0 })));
        }

        const results = await Promise.all(promises);

        setStats({
          users: results[0].total || 0,
          students: results[1].total || 0,
          schools: results[2].total || 0,
          buses: results[3].total || 0,
          organizations: isSuperAdmin ? (results[4]?.total || 0) : 0,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    ...(isSuperAdmin ? [{ title: 'Organizasyonlar', value: stats.organizations, icon: BusinessIcon, color: '#073662' }] : []),
    { title: 'Kullanıcılar', value: stats.users, icon: PeopleIcon, color: '#18A1D8' },
    { title: 'Öğrenciler', value: stats.students, icon: GroupIcon, color: '#22C55E' },
    { title: 'Okullar', value: stats.schools, icon: SchoolIcon, color: '#FFAB00' },
    { title: 'Servisler', value: stats.buses, icon: DirectionsBusIcon, color: '#FF4842' },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            mb: 1,
          }}
        >
          Hoş Geldiniz{user?.full_name ? `, ${user.full_name}` : ''} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isSuperAdmin
            ? 'Servis Takip Sistemi platform yönetim paneline hoş geldiniz.'
            : 'Servis Takip Sistemi yönetim paneline hoş geldiniz.'}
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={stat.title}>
            <StatCard {...stat} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Info Section */}
      <Box sx={{ mt: 4 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(7, 54, 98, 0.03) 0%, rgba(24, 161, 216, 0.03) 100%)',
            border: '1px solid rgba(24, 161, 216, 0.1)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #18A1D8 0%, #073662 100%)',
                }}
              >
                <TrendingUpIcon sx={{ color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Sistem Durumu
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tüm sistemler normal çalışıyor
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Konum takibi ve diğer gerçek zamanlı işlemler mobil uygulamalar üzerinden yapılmaktadır.
              Bu panelden kullanıcı, öğrenci, okul ve servis yönetimini gerçekleştirebilirsiniz.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
