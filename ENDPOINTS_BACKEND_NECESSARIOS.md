# 📚 Documentação de Endpoints - Backend AvenSuites

## 📋 Índice
1. [Autenticação](#autenticação)
2. [Hotéis](#hotéis)
3. [Quartos](#quartos)
4. [Hóspedes](#hóspedes)
5. [Reservas](#reservas)
6. [Notas Fiscais](#notas-fiscais)
7. [Modelos de Dados](#modelos-de-dados)

---

## 🔐 Autenticação

### POST `/Auth/login`
Realiza login e retorna token JWT.

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "roles": ["ADMIN", "USER"],
    "image": "https://avatar.url/image.jpg"
  },
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "E-mail ou senha inválidos"
}
```

**Modelo C#:**
```csharp
public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    public string Password { get; set; }
}

public class LoginResponse
{
    public string Token { get; set; }
    public UserDTO User { get; set; }
    public DateTime? ExpiresAt { get; set; }
}

public class UserDTO
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public List<string> Roles { get; set; }
    public string Image { get; set; }
}
```

---

## 🏨 Hotéis

### GET `/Hotel`
Lista todos os hotéis.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Hotel Paradise",
    "address": "Rua ABC, 123 - Centro",
    "city": "Florianópolis",
    "state": "SC",
    "zipCode": "88000-000",
    "phone": "(47) 99999-9999",
    "email": "contato@hotelparadise.com",
    "description": "Hotel de luxo com vista para o mar",
    "stars": 5,
    "checkInTime": "14:00",
    "checkOutTime": "12:00",
    "amenities": ["Wi-Fi", "Piscina", "Estacionamento", "Academia"],
    "images": ["url1.jpg", "url2.jpg"],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

**Modelo C#:**
```csharp
public class Hotel
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; }
    
    [Required]
    public string Address { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string City { get; set; }
    
    [Required]
    [MaxLength(2)]
    public string State { get; set; }
    
    [MaxLength(10)]
    public string ZipCode { get; set; }
    
    [Phone]
    public string Phone { get; set; }
    
    [EmailAddress]
    public string Email { get; set; }
    
    public string Description { get; set; }
    
    [Range(1, 5)]
    public int? Stars { get; set; }
    
    public string CheckInTime { get; set; }
    public string CheckOutTime { get; set; }
    
    public List<string> Amenities { get; set; }
    public List<string> Images { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Relacionamentos
    public virtual ICollection<Room> Rooms { get; set; }
    public virtual ICollection<Booking> Bookings { get; set; }
}
```

### GET `/Hotel/{id}`
Busca um hotel específico.

**Response (200 OK):** Mesmo formato do GET acima (objeto único)

**Response (404 Not Found):**
```json
{
  "message": "Hotel não encontrado"
}
```

### POST `/Hotel`
Cria um novo hotel.

**Request:**
```json
{
  "name": "Grand Hotel",
  "address": "Av. Principal, 456",
  "city": "Florianópolis",
  "state": "SC",
  "zipCode": "88010-000",
  "phone": "(47) 3333-4444",
  "email": "contato@grandhotel.com",
  "description": "Hotel moderno no centro",
  "stars": 4,
  "checkInTime": "14:00",
  "checkOutTime": "12:00",
  "amenities": ["Wi-Fi", "Café da manhã"],
  "images": []
}
```

**Response (201 Created):** Retorna o hotel criado

### PUT `/Hotel/{id}`
Atualiza um hotel.

**Request:** Mesmo formato do POST

**Response (200 OK):** Retorna o hotel atualizado

### DELETE `/Hotel/{id}`
Remove um hotel (soft delete recomendado).

**Response (204 No Content)**

---

## 🛏️ Quartos

### GET `/Room`
Lista todos os quartos.

**Query Parameters (opcionais):**
- `hotelId` - Filtrar por hotel
- `status` - Filtrar por status
- `type` - Filtrar por tipo

**Response (200 OK):**
```json
[
  {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "hotelId": "123e4567-e89b-12d3-a456-426614174000",
    "number": "101",
    "floor": 1,
    "type": "Standard",
    "status": "Available",
    "capacity": 2,
    "pricePerNight": 250.00,
    "description": "Quarto standard com cama de casal",
    "amenities": ["TV", "Ar-condicionado", "Frigobar"],
    "images": ["room1.jpg"],
    "size": 25.5,
    "bedType": "Queen",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

**Modelo C#:**
```csharp
public enum RoomStatus
{
    Available,      // Disponível
    Occupied,       // Ocupado
    Maintenance,    // Manutenção
    Cleaning        // Limpeza
}

public enum RoomType
{
    Standard,
    Deluxe,
    Suite,
    Presidential
}

public class Room
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid HotelId { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string Number { get; set; }
    
    public int Floor { get; set; }
    
    [Required]
    public RoomType Type { get; set; }
    
    [Required]
    public RoomStatus Status { get; set; } = RoomStatus.Available;
    
    [Range(1, 10)]
    public int Capacity { get; set; }
    
    [Required]
    [Range(0, 999999)]
    public decimal PricePerNight { get; set; }
    
    public string Description { get; set; }
    
    public List<string> Amenities { get; set; }
    public List<string> Images { get; set; }
    
    public double? Size { get; set; } // em m²
    public string BedType { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Relacionamentos
    public virtual Hotel Hotel { get; set; }
    public virtual ICollection<Booking> Bookings { get; set; }
}
```

### GET `/Room/{id}`
Busca um quarto específico.

### POST `/Room`
Cria um novo quarto.

**Request:**
```json
{
  "hotelId": "123e4567-e89b-12d3-a456-426614174000",
  "number": "201",
  "floor": 2,
  "type": "Deluxe",
  "status": "Available",
  "capacity": 3,
  "pricePerNight": 350.00,
  "description": "Quarto deluxe com varanda",
  "amenities": ["TV", "Ar-condicionado", "Varanda"],
  "size": 35.0,
  "bedType": "King"
}
```

### PUT `/Room/{id}`
Atualiza um quarto.

### DELETE `/Room/{id}`
Remove um quarto.

---

## 👥 Hóspedes

### GET `/Guest`
Lista todos os hóspedes.

**Response (200 OK):**
```json
[
  {
    "id": "789e0123-e89b-12d3-a456-426614174002",
    "firstName": "João",
    "lastName": "Silva",
    "fullName": "João Silva",
    "email": "joao.silva@email.com",
    "phone": "(47) 99999-8888",
    "cpf": "123.456.789-00",
    "rg": "1234567",
    "birthDate": "1990-05-15",
    "nationality": "Brasileiro",
    "address": {
      "street": "Rua das Flores",
      "number": "123",
      "complement": "Apt 45",
      "neighborhood": "Centro",
      "city": "Florianópolis",
      "state": "SC",
      "zipCode": "88000-000"
    },
    "emergencyContact": {
      "name": "Maria Silva",
      "phone": "(47) 98888-7777",
      "relationship": "Esposa"
    },
    "preferences": ["Quarto silencioso", "Andar alto"],
    "isVip": false,
    "notes": "Cliente frequente",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

**Modelo C#:**
```csharp
public class Guest
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; }
    
    [NotMapped]
    public string FullName => $"{FirstName} {LastName}";
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Phone]
    public string Phone { get; set; }
    
    [MaxLength(14)] // 000.000.000-00
    public string CPF { get; set; }
    
    [MaxLength(20)]
    public string RG { get; set; }
    
    public DateTime? BirthDate { get; set; }
    
    [MaxLength(50)]
    public string Nationality { get; set; }
    
    // Endereço (pode ser classe separada)
    public string AddressStreet { get; set; }
    public string AddressNumber { get; set; }
    public string AddressComplement { get; set; }
    public string AddressNeighborhood { get; set; }
    public string AddressCity { get; set; }
    public string AddressState { get; set; }
    public string AddressZipCode { get; set; }
    
    // Contato de emergência
    public string EmergencyContactName { get; set; }
    public string EmergencyContactPhone { get; set; }
    public string EmergencyContactRelationship { get; set; }
    
    public List<string> Preferences { get; set; }
    
    public bool IsVip { get; set; } = false;
    
    public string Notes { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Relacionamentos
    public virtual ICollection<Booking> Bookings { get; set; }
}
```

### GET `/Guest/{id}`
Busca um hóspede específico.

### POST `/Guest`
Cria um novo hóspede.

### PUT `/Guest/{id}`
Atualiza um hóspede.

### DELETE `/Guest/{id}`
Remove um hóspede.

---

## 📅 Reservas

### GET `/Booking`
Lista todas as reservas.

**Query Parameters (opcionais):**
- `hotelId` - Filtrar por hotel
- `guestId` - Filtrar por hóspede
- `status` - Filtrar por status
- `startDate` - Data inicial
- `endDate` - Data final

**Response (200 OK):**
```json
[
  {
    "id": "012e3456-e89b-12d3-a456-426614174003",
    "bookingNumber": "BKG-2024-00123",
    "hotelId": "123e4567-e89b-12d3-a456-426614174000",
    "hotelName": "Hotel Paradise",
    "roomId": "456e7890-e89b-12d3-a456-426614174001",
    "roomNumber": "101",
    "guestId": "789e0123-e89b-12d3-a456-426614174002",
    "guestName": "João Silva",
    "checkInDate": "2024-02-01T14:00:00Z",
    "checkOutDate": "2024-02-05T12:00:00Z",
    "numberOfGuests": 2,
    "numberOfNights": 4,
    "pricePerNight": 250.00,
    "totalAmount": 1000.00,
    "status": "Confirmed",
    "paymentStatus": "Paid",
    "paymentMethod": "CreditCard",
    "specialRequests": "Quarto com vista para o mar",
    "notes": "Check-in antecipado solicitado",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "cancelledAt": null,
    "cancellationReason": null
  }
]
```

**Modelo C#:**
```csharp
public enum BookingStatus
{
    Pending,        // Pendente
    Confirmed,      // Confirmada
    CheckedIn,      // Check-in realizado
    CheckedOut,     // Check-out realizado
    Cancelled,      // Cancelada
    NoShow          // Não compareceu
}

public enum PaymentStatus
{
    Pending,        // Pendente
    Paid,           // Pago
    PartiallyPaid,  // Parcialmente pago
    Refunded        // Reembolsado
}

public class Booking
{
    public Guid Id { get; set; }
    
    [MaxLength(50)]
    public string BookingNumber { get; set; } // Auto-gerado
    
    [Required]
    public Guid HotelId { get; set; }
    
    [Required]
    public Guid RoomId { get; set; }
    
    [Required]
    public Guid GuestId { get; set; }
    
    [Required]
    public DateTime CheckInDate { get; set; }
    
    [Required]
    public DateTime CheckOutDate { get; set; }
    
    [Range(1, 10)]
    public int NumberOfGuests { get; set; }
    
    [NotMapped]
    public int NumberOfNights => (CheckOutDate.Date - CheckInDate.Date).Days;
    
    [Required]
    [Range(0, 999999)]
    public decimal PricePerNight { get; set; }
    
    [Required]
    [Range(0, 999999)]
    public decimal TotalAmount { get; set; }
    
    [Required]
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    
    [Required]
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    [MaxLength(50)]
    public string PaymentMethod { get; set; }
    
    public string SpecialRequests { get; set; }
    public string Notes { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string CancellationReason { get; set; }
    
    // Relacionamentos
    public virtual Hotel Hotel { get; set; }
    public virtual Room Room { get; set; }
    public virtual Guest Guest { get; set; }
    public virtual Invoice Invoice { get; set; }
}
```

### GET `/Booking/{id}`
Busca uma reserva específica.

### POST `/Booking`
Cria uma nova reserva.

**Request:**
```json
{
  "hotelId": "123e4567-e89b-12d3-a456-426614174000",
  "roomId": "456e7890-e89b-12d3-a456-426614174001",
  "guestId": "789e0123-e89b-12d3-a456-426614174002",
  "checkInDate": "2024-02-10T14:00:00Z",
  "checkOutDate": "2024-02-15T12:00:00Z",
  "numberOfGuests": 2,
  "pricePerNight": 250.00,
  "specialRequests": "Andar alto preferível"
}
```

**Validações importantes:**
- Verificar se o quarto está disponível no período
- Calcular automaticamente: numberOfNights, totalAmount
- Gerar bookingNumber único
- Verificar capacity do quarto vs numberOfGuests

### PUT `/Booking/{id}`
Atualiza uma reserva.

### DELETE `/Booking/{id}`
Cancela uma reserva (soft delete).

### POST `/Booking/{id}/check-in`
Realiza check-in.

**Response (200 OK):**
```json
{
  "message": "Check-in realizado com sucesso",
  "booking": { ... }
}
```

### POST `/Booking/{id}/check-out`
Realiza check-out.

---

## 📄 Notas Fiscais

### GET `/Invoice`
Lista todas as notas fiscais.

**Query Parameters (opcionais):**
- `status` - Filtrar por status
- `startDate` - Data inicial
- `endDate` - Data final
- `guestId` - Filtrar por hóspede

**Response (200 OK):**
```json
[
  {
    "id": "345e6789-e89b-12d3-a456-426614174004",
    "number": "NF-2024-00001",
    "bookingId": "012e3456-e89b-12d3-a456-426614174003",
    "guestId": "789e0123-e89b-12d3-a456-426614174002",
    "guestName": "João Silva",
    "hotelId": "123e4567-e89b-12d3-a456-426614174000",
    "hotelName": "Hotel Paradise",
    "amount": 1000.00,
    "taxAmount": 50.00,
    "totalAmount": 1050.00,
    "status": "Paid",
    "issueDate": "2024-02-05T12:00:00Z",
    "dueDate": "2024-02-15T23:59:59Z",
    "paymentDate": "2024-02-10T15:30:00Z",
    "paymentMethod": "CreditCard",
    "description": "Hospedagem de 4 diárias - Quarto 101",
    "items": [
      {
        "description": "Hospedagem - 4 diárias",
        "quantity": 4,
        "unitPrice": 250.00,
        "totalPrice": 1000.00
      }
    ],
    "notes": "Pagamento realizado via cartão de crédito",
    "createdAt": "2024-02-05T12:00:00Z",
    "updatedAt": "2024-02-10T15:30:00Z"
  }
]
```

**Modelo C#:**
```csharp
public enum InvoiceStatus
{
    Pending,    // Pendente
    Paid,       // Paga
    Overdue,    // Vencida
    Cancelled   // Cancelada
}

public class InvoiceItem
{
    public Guid Id { get; set; }
    public Guid InvoiceId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Description { get; set; }
    
    [Range(1, 9999)]
    public int Quantity { get; set; }
    
    [Range(0, 999999)]
    public decimal UnitPrice { get; set; }
    
    [Range(0, 999999)]
    public decimal TotalPrice { get; set; }
    
    public virtual Invoice Invoice { get; set; }
}

public class Invoice
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Number { get; set; } // Auto-gerado: NF-YYYY-NNNNN
    
    [Required]
    public Guid BookingId { get; set; }
    
    [Required]
    public Guid GuestId { get; set; }
    
    [Required]
    public Guid HotelId { get; set; }
    
    [Required]
    [Range(0, 999999)]
    public decimal Amount { get; set; }
    
    [Range(0, 999999)]
    public decimal TaxAmount { get; set; }
    
    [Required]
    [Range(0, 999999)]
    public decimal TotalAmount { get; set; }
    
    [Required]
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Pending;
    
    [Required]
    public DateTime IssueDate { get; set; }
    
    [Required]
    public DateTime DueDate { get; set; }
    
    public DateTime? PaymentDate { get; set; }
    
    [MaxLength(50)]
    public string PaymentMethod { get; set; }
    
    public string Description { get; set; }
    
    public List<InvoiceItem> Items { get; set; }
    
    public string Notes { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Relacionamentos
    public virtual Booking Booking { get; set; }
    public virtual Guest Guest { get; set; }
    public virtual Hotel Hotel { get; set; }
}
```

### GET `/Invoice/{id}`
Busca uma nota fiscal específica.

### POST `/Invoice`
Cria uma nova nota fiscal.

**Request:**
```json
{
  "bookingId": "012e3456-e89b-12d3-a456-426614174003",
  "guestId": "789e0123-e89b-12d3-a456-426614174002",
  "hotelId": "123e4567-e89b-12d3-a456-426614174000",
  "amount": 1000.00,
  "taxAmount": 50.00,
  "dueDate": "2024-02-15T23:59:59Z",
  "description": "Hospedagem de 4 diárias",
  "items": [
    {
      "description": "Hospedagem - Quarto 101",
      "quantity": 4,
      "unitPrice": 250.00,
      "totalPrice": 1000.00
    }
  ]
}
```

**Validações importantes:**
- Gerar number único (NF-YYYY-NNNNN)
- Calcular totalAmount = amount + taxAmount
- issueDate = data atual
- Verificar se booking existe

### PUT `/Invoice/{id}`
Atualiza uma nota fiscal.

### POST `/Invoice/{id}/pay`
Registra pagamento da nota fiscal.

**Request:**
```json
{
  "paymentMethod": "CreditCard",
  "paymentDate": "2024-02-10T15:30:00Z",
  "notes": "Pagamento via cartão final 1234"
}
```

**Response (200 OK):**
```json
{
  "message": "Pagamento registrado com sucesso",
  "invoice": { ... }
}
```

---

## 📦 Modelos de Dados Completos

### Resumo das Entidades:

```
Hotel
├── Id (Guid)
├── Name (string)
├── Address (string)
├── City (string)
├── State (string)
├── Phone (string)
├── Email (string)
└── Rooms (ICollection<Room>)

Room
├── Id (Guid)
├── HotelId (Guid)
├── Number (string)
├── Type (enum)
├── Status (enum)
├── PricePerNight (decimal)
└── Hotel (Hotel)

Guest
├── Id (Guid)
├── FirstName (string)
├── LastName (string)
├── Email (string)
├── Phone (string)
├── CPF (string)
└── Bookings (ICollection<Booking>)

Booking
├── Id (Guid)
├── BookingNumber (string)
├── HotelId (Guid)
├── RoomId (Guid)
├── GuestId (Guid)
├── CheckInDate (DateTime)
├── CheckOutDate (DateTime)
├── TotalAmount (decimal)
├── Status (enum)
├── Hotel (Hotel)
├── Room (Room)
├── Guest (Guest)
└── Invoice (Invoice)

Invoice
├── Id (Guid)
├── Number (string)
├── BookingId (Guid)
├── GuestId (Guid)
├── HotelId (Guid)
├── TotalAmount (decimal)
├── Status (enum)
├── IssueDate (DateTime)
├── DueDate (DateTime)
├── Booking (Booking)
├── Guest (Guest)
├── Hotel (Hotel)
└── Items (ICollection<InvoiceItem>)
```

---

## 🔒 Autenticação e Autorização

### Headers Obrigatórios:
Todos os endpoints (exceto `/Auth/login`) requerem:

```
Authorization: Bearer {token}
Content-Type: application/json
```

### Roles Sugeridas:
- **ADMIN**: Acesso total
- **MANAGER**: Gerenciar hotel, quartos, reservas
- **EMPLOYEE**: Visualizar e criar reservas
- **USER**: Visualizar apenas

### Implementação JWT:
```csharp
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HotelController : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "ADMIN,MANAGER,EMPLOYEE")]
    public async Task<IActionResult> GetAll()
    {
        // ...
    }
    
    [HttpPost]
    [Authorize(Roles = "ADMIN,MANAGER")]
    public async Task<IActionResult> Create([FromBody] CreateHotelRequest request)
    {
        // ...
    }
}
```

---

## 🚀 Prioridade de Implementação

### Fase 1 - Essencial (MVP):
1. ✅ **POST `/Auth/login`** - Login
2. ✅ **GET `/Hotel`** - Listar hotéis
3. ✅ **GET `/Room`** - Listar quartos
4. ✅ **GET `/Guest`** - Listar hóspedes
5. ✅ **GET `/Booking`** - Listar reservas
6. ✅ **GET `/Invoice`** - Listar notas fiscais

### Fase 2 - CRUD Completo:
7. POST/PUT/DELETE para Hotel
8. POST/PUT/DELETE para Room
9. POST/PUT/DELETE para Guest
10. POST/PUT/DELETE para Booking
11. POST/PUT/DELETE para Invoice

### Fase 3 - Funcionalidades Avançadas:
12. Check-in/Check-out
13. Pagamento de notas fiscais
14. Relatórios e estatísticas
15. Upload de imagens
16. Notificações

---

## 📝 Notas Importantes

### Paginação (Recomendado):
Para endpoints GET que retornam listas:

**Query Parameters:**
```
?page=1&pageSize=20&sortBy=createdAt&sortOrder=desc
```

**Response:**
```json
{
  "data": [...],
  "totalCount": 150,
  "page": 1,
  "pageSize": 20,
  "totalPages": 8
}
```

### Tratamento de Erros:
Sempre retornar formato consistente:

```json
{
  "message": "Mensagem de erro amigável",
  "errors": {
    "field1": ["Erro específico do campo"],
    "field2": ["Outro erro"]
  },
  "statusCode": 400
}
```

### Validações Importantes:
- ✅ Validar datas (CheckIn < CheckOut)
- ✅ Verificar disponibilidade de quartos
- ✅ Validar CPF/Email únicos
- ✅ Verificar capacidade do quarto
- ✅ Calcular valores automaticamente
- ✅ Gerar números únicos (BookingNumber, InvoiceNumber)

---

## 📚 Exemplo de Implementação Completa

### HotelController.cs:
```csharp
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HotelController : ControllerBase
{
    private readonly IHotelRepository _hotelRepository;
    private readonly ILogger<HotelController> _logger;

    public HotelController(
        IHotelRepository hotelRepository,
        ILogger<HotelController> logger)
    {
        _hotelRepository = hotelRepository;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "ADMIN,MANAGER,EMPLOYEE")]
    [ProducesResponseType(typeof(IEnumerable<Hotel>), 200)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var hotels = await _hotelRepository.GetAllAsync();
            return Ok(hotels);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar hotéis");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "ADMIN,MANAGER,EMPLOYEE")]
    [ProducesResponseType(typeof(Hotel), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var hotel = await _hotelRepository.GetByIdAsync(id);
        
        if (hotel == null)
            return NotFound(new { message = "Hotel não encontrado" });
            
        return Ok(hotel);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN,MANAGER")]
    [ProducesResponseType(typeof(Hotel), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Create([FromBody] CreateHotelRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var hotel = new Hotel
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Address = request.Address,
            City = request.City,
            State = request.State,
            Phone = request.Phone,
            Email = request.Email,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _hotelRepository.AddAsync(hotel);
        
        return CreatedAtAction(nameof(GetById), new { id = hotel.Id }, hotel);
    }
}
```

---

## ✅ Checklist de Implementação

- [ ] Criar banco de dados com as 5 tabelas principais
- [ ] Implementar autenticação JWT
- [ ] Criar controllers para cada entidade
- [ ] Implementar repositories/services
- [ ] Adicionar validações de dados
- [ ] Configurar CORS para o frontend
- [ ] Testar todos os endpoints
- [ ] Adicionar logs
- [ ] Configurar HTTPS
- [ ] Documentar com Swagger

---

**📞 Dúvidas?** Consulte este documento ou ajuste conforme necessário!

**Versão**: 1.0.0  
**Data**: 2025

