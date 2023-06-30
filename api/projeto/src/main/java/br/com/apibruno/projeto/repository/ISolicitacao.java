package br.com.apibruno.projeto.repository;

//import org.hibernate.metamodel.model.convert.spi.JpaAttributeConverter;
//import org.springframework.data.repository.CrudRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.apibruno.projeto.model.solicitacao;

public interface ISolicitacao extends JpaRepository<solicitacao, Integer>{

}
