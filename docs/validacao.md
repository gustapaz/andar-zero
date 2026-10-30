# Validação

- 11 testes aprovados: percorrem todos os caminhos possíveis, comprovam alcance das 17 cenas e dos três desfechos, verificam que não há ciclos, requisitos de pistas, inventário sem duplicatas, retorno, reinício, persistência, rejeição de caminhos inválidos, exportação e ilustrações sem recursos remotos.
- TypeScript, formatação e build aprovados. JavaScript minificado: aproximadamente 51,9 kB (19,8 kB gzip). CSS: 15,1 kB (3,9 kB gzip). Fontes locais e desenhos vetoriais, sem imagens de rede.
- Os três finais foram alcançados no navegador. Retomada após recarga, releitura de finais, caderno e download TXT conferidos. O final com requisitos permaneceu desabilitado no caminho sem os três fragmentos.
- Reinício com restauração testado. Preferências de texto ampliado e leitura sem ilustrações testadas. Diálogo nativo, Escape, foco e botões de escolha por teclado disponíveis.
- Inspeção em 1280 px, 768 px, 390 px e 320 px. Sem rolagem horizontal acidental nas áreas revisadas. O movimento da ilustração não recorta nem bloqueia os controles de escolha.
- Conteúdo fictício sinalizado, metadados sociais e canonical configurados para o endereço público. A página inteira usa a mesma URL, e o progresso recupera a cena após recarregar.

Não foram atribuídas notas de Lighthouse nem realizada certificação com leitor de tela. Preferência de movimento reduzido implementada em CSS; erro de armazenamento tratado no código, sem forçar essa condição no navegador. As ilustrações são decorativas para a tomada de decisões e podem ser ocultadas mantendo a narrativa completa.
