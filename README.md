
## API Integration

The application expects a backend API running at `http://localhost:8000/api`. Make sure to update the API URL in `payment.service.ts` if your backend is running on a different port.

## Features in Detail

### Payment List
- Server-side pagination
- Search functionality
- Status indicators with color coding
- Actions: Edit, Delete, Download Evidence

### Payment Form
- Comprehensive form with validations
- Auto-complete for location fields
- File upload for evidence
- Dynamic status management
- Calculated total due amount

### Location Services
- Country selection (ISO 3166-1 alpha-2)
- Dynamic city and state loading
- Auto-complete functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details