// Simulação de base de dados em memória (substitua por base de dados real)
let users = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@armazem.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: null
  }
];

class UserService {
  async findAll(options = {}) {
    const { page = 1, limit = 10 } = options;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      users: users.slice(startIndex, endIndex).map(user => ({
        ...user,
        password: undefined // Remove senha da resposta
      })),
      total: users.length,
      page,
      limit,
      totalPages: Math.ceil(users.length / limit)
    };
  }

  async findById(id) {
    const user = users.find(u => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async findByEmail(email) {
    return users.find(u => u.email === email);
  }

  async create(userData) {
    users.push(userData);
    const { password, ...userWithoutPassword } = userData;
    return userWithoutPassword;
  }

  async update(id, updateData) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updateData };
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }

  async delete(id) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return false;

    users.splice(userIndex, 1);
    return true;
  }

  async updateLastLogin(id) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString();
    }
  }
}

module.exports = new UserService();