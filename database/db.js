import fs  from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Factory para criar a instância do banco de dados simulado.
 * @param {string} filename - Nome do arquivo JSON onde os dados serão salvos.
 */
export const createDatabase = (filename = 'database.json') => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.resolve(__dirname, filename);

  // --- Funções Privadas --- //

  // Lê o arquivo e retorna os dados. Cria um array vazio se o arquivo não existir.
  const _readData = async () => {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      
      if (!data || data.trim() === '') {
        return [];
      }
      
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []; // Arquivo não encontrado, retorna banco vazio
      }
      
      if (error instanceof SyntaxError) {
        console.warn("Aviso: Arquivo JSON corrompido ou inválido. Iniciando com banco vazio.");
        return [];
      }
      
      throw new Error(`Erro ao ler o banco de dados: ${error.message}`);
    }
  };

  // Salva os dados no arquivo JSON
  const _writeData = async (data) => {
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Erro ao salvar no banco de dados: ${error.message}`);
    }
  };

  // --- Funções Públicas (API do Banco) --- //

  /**
   * Retorna todos os registros.
   */
  const getAll = async () => {
    return await _readData();
  };

  /**
   * Busca um registro específico pelo ID.
   * @param {string|number} id 
   */
  const getById = async (id) => {
    const data = await _readData();
    return data.find(item => item.id === id) || null;
  };

  /**
   * Insere um novo registro no banco.
   * @param {Object} record - Dados a serem inseridos.
   */
  const insert = async (record) => {
    const data = await _readData();
    
    // Cria um ID simples baseado no timestamp se não existir
    const newRecord = {
      id: record.id || Date.now().toString(),
      createdAt: record.createdAt || new Date().toISOString(),
      ...record
    };

    data.push(newRecord);
    await _writeData(data);
    
    return newRecord;
  };

  /**
   * Atualiza um registro existente.
   * @param {string|number} id 
   * @param {Object} updates - Campos para atualizar.
   */
  const update = async (id, updates) => {
    const data = await _readData();
    const index = data.findIndex(item => item.id === id);

    if (index === -1) return null; // Registro não encontrado

    // Mescla os dados antigos com as atualizações
    data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
    await _writeData(data);

    return data[index];
  };

  /**
   * Remove um registro do banco pelo ID.
   * @param {string|number} id 
   */
  const remove = async (id) => {
    const data = await _readData();
    const filteredData = data.filter(item => item.id !== id);

    if (data.length === filteredData.length) {
      return false; // Nada foi removido
    }

    await _writeData(filteredData);
    return true;
  };

  // Retorna os métodos públicos, congelando o objeto para evitar mutações indesejadas
  return Object.freeze({
    getAll,
    getById,
    insert,
    update,
    remove
  });
};