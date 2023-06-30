package br.com.apibruno.projeto.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.apibruno.projeto.model.solicitacao;
import br.com.apibruno.projeto.repository.ISolicitacao;

@Service
public class SolicitacaoService {
	
	private ISolicitacao repository;
	
	public SolicitacaoService (ISolicitacao repository) {
		this.repository = repository;
	}
	
	public List <solicitacao> ListarSolicitacao(){
		List <solicitacao> lista = repository.findAll();
		return lista;
	}
	
	public solicitacao criarSolicitacao (solicitacao solicitacao) {
		solicitacao solicitacaoNova = repository.save(solicitacao);
		return solicitacaoNova;
		
	}
	
	public solicitacao editarSolicitacao (solicitacao solicitacao) {
		solicitacao solicitacaoNova = repository.save(solicitacao);
		return solicitacaoNova;
		
	}
	
	public Boolean excluirSolicitacao (Integer id) {
		repository.deleteById(id);
		return true;
		
	}
	
}
