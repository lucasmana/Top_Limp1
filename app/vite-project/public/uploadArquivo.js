// uploadArquivo.js
class UploadArquivo {
    constructor(options = {}) {
        this.apiUrl = options.apiUrl || 'http://localhost:3000/api';
        this.onUploadStart = options.onUploadStart || (() => {});
        this.onUploadProgress = options.onUploadProgress || (() => {});
        this.onUploadComplete = options.onUploadComplete || (() => {});
        this.onUploadError = options.onUploadError || (() => {});
    }

    // Verificar tipo de arquivo permitido
    isArquivoPermitido(arquivo) {
        const extensao = arquivo.name.split('.').pop().toLowerCase();
        const tiposPermitidos = ['pdf', 'doc', 'docx'];
        return tiposPermitidos.includes(extensao);
    }

    // Upload de arquivo
    async uploadArquivo(arquivo) {
        try {
            this.onUploadStart(arquivo);

            // Validar arquivo
            if (!this.isArquivoPermitido(arquivo)) {
                throw new Error('Tipo de arquivo não permitido. Use PDF ou Word.');
            }

            const formData = new FormData();
            formData.append('arquivo', arquivo);

            const response = await fetch(`${this.apiUrl}/orcamentos/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.mensagem || 'Erro no upload');
            }

            this.onUploadComplete(data.arquivo);
            return data.arquivo;

        } catch (error) {
            this.onUploadError(error);
            throw error;
        }
    }

    // Criar orçamento com arquivo
    async criarOrcamentoComArquivo(dadosOrcamento, arquivo) {
        try {
            this.onUploadStart(arquivo);

            // Validar arquivo
            if (arquivo && !this.isArquivoPermitido(arquivo)) {
                throw new Error('Tipo de arquivo não permitido. Use PDF ou Word.');
            }

            const formData = new FormData();
            
            // Adicionar todos os campos do orçamento
            Object.keys(dadosOrcamento).forEach(key => {
                if (key === 'estruturas' && dadosOrcamento.estruturas) {
                    formData.append(key, JSON.stringify(dadosOrcamento.estruturas));
                } else if (dadosOrcamento[key] !== undefined && dadosOrcamento[key] !== null) {
                    formData.append(key, dadosOrcamento[key]);
                }
            });

            // Adicionar arquivo se existir
            if (arquivo) {
                formData.append('arquivo', arquivo);
            }

            const response = await fetch(`${this.apiUrl}/orcamentos`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.mensagem || 'Erro ao criar orçamento');
            }

            this.onUploadComplete(data.orcamento);
            return data.orcamento;

        } catch (error) {
            this.onUploadError(error);
            throw error;
        }
    }

    // Atualizar orçamento com arquivo
    async atualizarOrcamentoComArquivo(id, dadosOrcamento, arquivo) {
        try {
            this.onUploadStart(arquivo);

            // Validar arquivo
            if (arquivo && !this.isArquivoPermitido(arquivo)) {
                throw new Error('Tipo de arquivo não permitido. Use PDF ou Word.');
            }

            const formData = new FormData();
            
            // Adicionar todos os campos do orçamento
            Object.keys(dadosOrcamento).forEach(key => {
                if (key === 'estruturas' && dadosOrcamento.estruturas) {
                    formData.append(key, JSON.stringify(dadosOrcamento.estruturas));
                } else if (dadosOrcamento[key] !== undefined && dadosOrcamento[key] !== null) {
                    formData.append(key, dadosOrcamento[key]);
                }
            });

            // Adicionar arquivo se existir
            if (arquivo) {
                formData.append('arquivo', arquivo);
            }

            const response = await fetch(`${this.apiUrl}/orcamentos/${id}`, {
                method: 'PUT',
                body: formData
            });

            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.mensagem || 'Erro ao atualizar orçamento');
            }

            this.onUploadComplete(data.orcamento);
            return data.orcamento;

        } catch (error) {
            this.onUploadError(error);
            throw error;
        }
    }

    // Download do arquivo
    async downloadArquivo(id) {
        try {
            window.open(`${this.apiUrl}/orcamentos/${id}/download`, '_blank');
        } catch (error) {
            console.error('Erro no download:', error);
            throw error;
        }
    }

    // Visualizar arquivo
    async visualizarArquivo(id) {
        try {
            window.open(`${this.apiUrl}/orcamentos/${id}/visualizar`, '_blank');
        } catch (error) {
            console.error('Erro ao visualizar:', error);
            throw error;
        }
    }

    // Buscar orçamento com informações do arquivo
    async buscarOrcamento(id) {
        try {
            const response = await fetch(`${this.apiUrl}/orcamentos/${id}`);
            const data = await response.json();
            
            if (!data.ok) {
                throw new Error(data.mensagem || 'Erro ao buscar orçamento');
            }
            
            return data.orcamento;
        } catch (error) {
            console.error('Erro ao buscar orçamento:', error);
            throw error;
        }
    }
}

// Exemplo de uso:
/*
const uploadHandler = new UploadArquivo({
    apiUrl: 'http://localhost:3000/api',
    onUploadStart: (arquivo) => {
        console.log('Iniciando upload:', arquivo.name);
        document.getElementById('status').innerHTML = 'Enviando...';
    },
    onUploadProgress: (progress) => {
        console.log('Progresso:', progress);
    },
    onUploadComplete: (resultado) => {
        console.log('Upload completo:', resultado);
        document.getElementById('status').innerHTML = 'Upload concluído!';
        
        if (resultado.caminho) {
            document.getElementById('caminhoArquivo').value = resultado.caminho;
        }
    },
    onUploadError: (error) => {
        console.error('Erro:', error);
        document.getElementById('status').innerHTML = 'Erro: ' + error.message;
    }
});

// Para upload simples
document.getElementById('btnUpload').addEventListener('click', async () => {
    const arquivo = document.getElementById('arquivoInput').files[0];
    if (arquivo) {
        try {
            const resultado = await uploadHandler.uploadArquivo(arquivo);
            console.log('Arquivo salvo em:', resultado.caminho);
        } catch (error) {
            // Erro já tratado no callback
        }
    }
});

// Para criar orçamento com arquivo
document.getElementById('btnSalvar').addEventListener('click', async () => {
    const arquivo = document.getElementById('arquivoInput').files[0];
    
    const dadosOrcamento = {
        numeroOrcamento: document.getElementById('numero').value,
        valorTotal: document.getElementById('valor').value,
        tipoServico: document.getElementById('tipoServico').value,
        periodicidade: document.getElementById('periodicidade').value,
        validade: document.getElementById('validade').value,
        parcelas: document.getElementById('parcelas').value,
        referente: document.getElementById('referente').value,
        clienteId: document.getElementById('clienteId').value,
        clienteNome: document.getElementById('clienteNome').value,
        clienteCnpj: document.getElementById('clienteCnpj').value
    };
    
    try {
        const orcamento = await uploadHandler.criarOrcamentoComArquivo(dadosOrcamento, arquivo);
        console.log('Orçamento criado:', orcamento);
        alert('Orçamento criado com sucesso!');
    } catch (error) {
        // Erro já tratado no callback
    }
});
*/

export default UploadArquivo;