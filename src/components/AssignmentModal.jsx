import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  MenuItem, 
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

const AssignmentModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  students,
  buses,
  parents
}) => {
  const [assignmentType, setAssignmentType] = useState('student-bus'); // 'student-bus' or 'parent-student'
  const [form, setForm] = useState({
    student_id: '',
    bus_id: '',
    parent_id: ''
  });

  useEffect(() => {
    if (!open) {
      setForm({
        student_id: '',
        bus_id: '',
        parent_id: ''
      });
      setAssignmentType('student-bus');
    }
  }, [open]);

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setAssignmentType(newType);
      setForm({
        student_id: form.student_id,
        bus_id: '',
        parent_id: ''
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(assignmentType, form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yeni Atama</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={assignmentType}
              exclusive
              onChange={handleTypeChange}
              aria-label="atama tipi"
              fullWidth
            >
              <ToggleButton value="student-bus" aria-label="öğrenci-otobüs">
                <DirectionsBusIcon sx={{ mr: 1 }} />
                Öğrenci-Otobüs
              </ToggleButton>
              <ToggleButton value="parent-student" aria-label="öğrenci-veli">
                <FamilyRestroomIcon sx={{ mr: 1 }} />
                Öğrenci-Veli
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <TextField
            margin="normal"
            label="Öğrenci"
            name="student_id"
            select
            fullWidth
            required
            value={form.student_id}
            onChange={handleChange}
          >
            {students && students.length > 0 ? (
              students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.full_name} ({student.student_number})
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                Öğrenci bulunamadı
              </MenuItem>
            )}
          </TextField>

          {assignmentType === 'student-bus' && (
            <TextField
              margin="normal"
              label="Otobüs"
              name="bus_id"
              select
              fullWidth
              required
              value={form.bus_id}
              onChange={handleChange}
              helperText="Öğrencinin atanacağı otobüs"
            >
              {buses && buses.length > 0 ? (
                buses.map((bus) => (
                  <MenuItem key={bus.id} value={bus.id}>
                    {bus.plate_number} (Kapasite: {bus.capacity})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  Otobüs bulunamadı
                </MenuItem>
              )}
            </TextField>
          )}

          {assignmentType === 'parent-student' && (
            <TextField
              margin="normal"
              label="Veli"
              name="parent_id"
              select
              fullWidth
              required
              value={form.parent_id}
              onChange={handleChange}
              helperText="Öğrencinin velisi"
            >
              {parents && parents.length > 0 ? (
                parents.map((parent) => (
                  <MenuItem key={parent.id} value={parent.id}>
                    {parent.full_name} ({parent.email})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  Veli bulunamadı
                </MenuItem>
              )}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained">Ata</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AssignmentModal;
