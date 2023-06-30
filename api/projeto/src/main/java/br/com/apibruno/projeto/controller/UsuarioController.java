package br.com.apibruno.projeto.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.apibruno.projeto.model.solicitacao;
import br.com.apibruno.projeto.service.SolicitacaoService;
import jakarta.validation.Valid;




@RestController
@CrossOrigin ("*")
@RequestMapping ("/solicitacao")
public class UsuarioController {

	
	private SolicitacaoService solicitacaoService;
	
	public UsuarioController(SolicitacaoService solicitacaoService) {
		this.solicitacaoService = solicitacaoService;
	}
	
	@GetMapping 
	public ResponseEntity <List<solicitacao>> listaSolicitacao() {
		return ResponseEntity.status(200).body(solicitacaoService.ListarSolicitacao());
	}
	
	@PostMapping
	public ResponseEntity <solicitacao> criarSolicitacao (@Valid @RequestBody solicitacao solicitacao) {
		return ResponseEntity.status(201).body(solicitacaoService.criarSolicitacao(solicitacao));
	}
	
	@PutMapping
	public ResponseEntity <solicitacao> editarSolicitacao (@Valid @RequestBody solicitacao solicitacao) {
		return ResponseEntity.status(200).body(solicitacaoService.editarSolicitacao(solicitacao));
	}
	
	@DeleteMapping ("/{id}")
	public ResponseEntity <?> excluirSolicitacao (@PathVariable Integer id){
		solicitacaoService.excluirSolicitacao(id);
		return ResponseEntity.status(204).build();
		
		
	}
}
